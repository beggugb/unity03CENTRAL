import ComprobanteService from "../services/ComprobanteService";
import AsientoService from "../services/AsientoService"
import TdcService from "../services/TdcService"
import ProcesoService from "../services/ProcesoService";

class ComprobanteController {

    static search(req, res) {  
        const { prop, value } = req.body    
        let fechaGeneral = new Date()            
        let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = fechaGeneral.getFullYear()  
        ComprobanteService.search(fechaAnio, prop, value)
            .then((data) => {                          
              res.status(200).send({message:"clientes lista", result: data });            
            })                   
            .catch((reason) => {              
             
              res.status(400).send({ message: reason });
            });         
      }

    static aprobar(req, res) {   
        let fechaGeneral = new Date()            
        let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = fechaGeneral.getFullYear()    
        ComprobanteService.getItem(req.params.id)
        .then((xcomprobante)=>{
            let xok = xcomprobante
                xok.fechaCierre = fechaHoy
                xok.estado      = "aprobado"
            Promise.all([ComprobanteService.setUpdate(xok,req.params.id),ProcesoService.getPky(req.params.id)])
            .then(([ycomprobante,yproceso])=>{
                let yok = yproceso
                yok.estado = true
                yok.nivel = 2
                Promise.all([ProcesoService.setUpdate(yok,yok.id),ComprobanteService.getData(1,15,'id','desc')])
                .then(([zproceso,zcomprobantes])=>{
                    res.status(200).send({message:"Comprobantes lista", result: zcomprobantes });
                })
            })

        }) 
        .catch((reason) => {              
          
            res.status(400).send({ message: reason });
         });       
       
    }     

    static actualizar(req, res) { 
        const { item, items } = req.body 
        let fechaGeneral = new Date()            
        let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = fechaGeneral.getFullYear()               
        Promise.all([ComprobanteService.setUpdate(item,req.params.id),AsientoService.delete(req.params.id)]) 
        .then(([xcomprobante,xitems])=>{      
            let newItems = items.map((it,index)=>{
                let iok = {
                    pucId         : it.pucId,
                    comprobanteId : it.comprobanteId,
                    codigo        : it.codigo, 
                    descripcion   : it.descripcion,                        
                    debe          : it.debe,
                    haber         : it.haber,
                    fechaAsiento  : fechaHoy 
                }
            return iok;
            })      
            Promise.all([ComprobanteService.getItem(req.params.id)],AsientoService.setAdd(newItems)) 
            .then(([ycomprobante,yitems])=>{                
                AsientoService.getData(req.params.id)
                .then((zitems)=>{
                    res.status(200).send({message:"Comprobantes lista", result:{ item:ycomprobante, items:zitems} });
                })
                .catch((reason) => {              
                  
                    res.status(400).send({ message: reason });
                 });
            })
            .catch((reason) => {              
               
                res.status(400).send({ message: reason });
             });
        })
        .catch((reason) => {              
            console.log(reason)
            res.status(400).send({ message: reason });
         });
    } 
    
    static crear(req, res) {    
        const { usuarioId, tipoComprobante } = req.body             
        let fechaGeneral = new Date()            
        let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = fechaGeneral.getFullYear()              
        TdcService.verificar()
        .then((xtdc)=>{
           if(xtdc){
            ComprobanteService.getLastItem(tipoComprobante,fechaAnio)
                .then((yx)=>{
                  
                    let nncc = yx ? parseInt(yx.numComprobante) + 1 : 1   
                    
                    const iok={
                        fechaComprobante: fechaHoy,              
                        estado: 'transcripción',
                        label: 'vacio',
                        numComprobante: nncc,
                        glosaComprobante: '',
                        montoImpuesto: 0,
                        montoSubtotal: 0,
                        montoTotal: 0,
                        tipoComprobante: tipoComprobante,
                        gestion: fechaAnio,
                        tdc: parseFloat(xtdc.monto),
                        tDebe: 0,
                        tHaber: 0,
                        usuarioId: usuarioId            
                    }
           
            ComprobanteService.setAdd(iok)
                .then((xComprobante) => {  
                    let liok = {
                        nombre: "registro de comprobante",
                        nivel: 1,
                        estado: false,
                        usuarioId: usuarioId,
                        comprobanteId: xComprobante.id
                    }
                    ProcesoService.setAdd(liok)
                    .then((xproceso)=>{                      
                        ComprobanteService.getData(1,15,'id','desc')
                        .then((comprobantes) => {                
                            res.status(200).send({message:"Comprobantes lista", result: comprobantes });                                               
                        })      
                    })
                })
                .catch((reason) => {              
                  
                    res.status(400).send({ message: reason });
                 });
            })
                .catch((reason) => {              
                   
                    res.status(400).send({ message: reason });
                 });     
          
           }else{
            res.status(400).send({ message: "No tiene registrado el tipo de cambio para hoy" }); 
           }
        })
        .catch((reason) => {              
          
           res.status(400).send({ message: reason });
        });
   
            
    }    

    static getDelete(req, res) {  
        
       
    }

    static getItem(req, res) {  
        let fechaGeneral = new Date()            
        let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = fechaGeneral.getFullYear()                           
        Promise.all([ComprobanteService.getItem(req.params.id),AsientoService.getData(req.params.id)])
            .then(([item,data]) => {                  
                let resData = data.data.map((item,index)=>{
                    let iok = {
                    "id"            : item.id,   
                    "fechaAsiento"  : item.fechaAsiento,
                    "glosa"         : item.glosa,
                    "respaldo"      : item.respaldo,
                    "debe"          : item.debe,
                    "haber"         : item.haber,                    
                    "cc"            : item.cc,
                    "referencia"    : item.referencia,
                    "auxiliar"      : item.auxiliar,
                    "comprobanteId" : item.comprobanteId,                    
                    "pucId"         : item.pucId,
                    "codigo"        : item.puc.codigo,
                    "descripcion"   : item.puc.descripcion                                      
                    }
                return iok;
                })  
                res.status(200).send({message:"compras lista", result: {item:item, items: resData, total: data.total} });                                                              
            })                   
            .catch((reason) => {              
        
              res.status(400).send({ message: reason });
            });         
    }

    static getData(req, res) {                           
        ComprobanteService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((comprobantes) => {                
                res.status(200).send({message:"Comprobantes lista", result: comprobantes });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }

    static regComprobanteAut(monto, contado, banco, inicial,cuota,tipoComprobante,usuarioId,proveedor,observaciones){
        return new Promise((resolve,reject) =>{  
            let fechaGeneral = new Date()            
            let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
            let fechaAnio    = fechaGeneral.getFullYear()             
            TdcService.verificar()
                .then((xtdc)=>{                    
                        ComprobanteService.getLastItem(tipoComprobante,fechaAnio)
                            .then((yx)=>{          
                                let nncc = yx ? parseInt(yx.numComprobante) + 1 : 1               
                                const iok={
                                    fechaComprobante: fechaHoy,
                                    estado: 'transcripción',
                                    label: proveedor,
                                    numComprobante: nncc,
                                    glosaComprobante: observaciones,
                                    montoImpuesto: 0,
                                    montoSubtotal: 0,
                                    montoTotal: monto,
                                    tipoComprobante: tipoComprobante,
                                    gestion: fechaAnio,
                                    tdc: parseFloat(xtdc.monto),
                                    tDebe: parseFloat(monto),
                                    tHaber: parseFloat(monto),
                                    usuarioId: usuarioId            
                                }
   
                        ComprobanteService.setAdd(iok)
                            .then((xComprobante) => {
                                let items = regCompraXP(monto, contado, banco, inicial,cuota,xComprobante.id)
                                AsientoService.setAdd(items)
                                .then((iok)=>{
                                    let liok = {
                                        nombre: "registro de comprobante",
                                        nivel: 1,
                                        estado: true,
                                        usuarioId: usuarioId,
                                        comprobanteId: xComprobante.id
                                    }
                                    ProcesoService.setAdd(liok)
                                    .then((xproceso)=>{                                                              
                                        resolve({message: 'ok'})                                         
                                    })
                                })
                                .catch((reason)  => reject({ message: reason.message }))
                            })             

                    })               
                
                .catch((reason)  => reject({ message: reason.message })) 
               
        })
    })
     
 }
 static regPagoAut(monto,tipoComprobante,usuarioId,proveedor,observaciones,efectivo,banco,cheque){
    return new Promise((resolve,reject) =>{         
        let fechaGeneral = new Date()            
        let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = fechaGeneral.getFullYear()     
        TdcService.verificar()
            .then((xtdc)=>{                    
                    ComprobanteService.getLastItem(tipoComprobante,fechaAnio)
                        .then((yx)=>{          
                            let nncc = yx ? parseInt(yx.numComprobante) + 1 : 1               
                            const iok={
                                fechaComprobante: fechaHoy,               
                                estado: 'transcripción',
                                label: proveedor,
                                numComprobante: nncc,
                                glosaComprobante: observaciones,
                                montoImpuesto: 0,
                                montoSubtotal: 0,
                                montoTotal: monto,
                                tipoComprobante: tipoComprobante,
                                gestion: fechaAnio,
                                tdc: parseFloat(xtdc.monto),
                                tDebe: parseFloat(monto),
                                tHaber: parseFloat(monto),
                                usuarioId: usuarioId,      
                                nCheque: efectivo ? "": cheque,
                                nBanco : efectivo ? "": banco      
                            }

                    ComprobanteService.setAdd(iok)
                        .then((xComprobante) => {
                            let items = regPagoXP(efectivo,monto, xComprobante.id,true)
                            AsientoService.setAdd(items)
                            .then((iok)=>{
                                let liok = {
                                    nombre: "registro de comprobante",
                                    nivel: 1,
                                    estado: true,
                                    usuarioId: usuarioId,
                                    comprobanteId: xComprobante.id
                                }
                                ProcesoService.setAdd(liok)
                                .then((xproceso)=>{                                                              
                                    resolve({message: 'ok'})                                         
                                })
                            })
                            .catch((reason)  => reject({ message: reason.message }))
                        })             

                })               
            
            .catch((reason)  => reject({ message: reason.message })) 
           
    })
})
 
}
static regPagovAut(monto,tipoComprobante,usuarioId,cliente,observaciones,efectivo,banco,cheque){
    return new Promise((resolve,reject) =>{    
        let fechaGeneral = new Date()            
        let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = fechaGeneral.getFullYear()              
        TdcService.verificar()
            .then((xtdc)=>{                    
                    ComprobanteService.getLastItem(tipoComprobante,fechaAnio)
                        .then((yx)=>{          
                            let nncc = yx ? parseInt(yx.numComprobante) + 1 : 1               
                            const iok={
                                fechaComprobante: fechaHoy,
                                estado: 'transcripción',
                                label: cliente,
                                numComprobante: nncc,
                                glosaComprobante: observaciones,
                                montoImpuesto: 0,
                                montoSubtotal: 0,
                                montoTotal: monto,
                                tipoComprobante: tipoComprobante,
                                gestion: fechaAnio,
                                tdc: parseFloat(xtdc.monto),
                                tDebe: parseFloat(monto),
                                tHaber: parseFloat(monto),
                                usuarioId: usuarioId,
                                nCheque: efectivo ? "": cheque,
                                nBanco : efectivo ? "": banco             
                            }

                    ComprobanteService.setAdd(iok)
                        .then((xComprobante) => {
                            let items = regPagoXP(efectivo,monto, xComprobante.id,false)
                            AsientoService.setAdd(items)
                            .then((iok)=>{
                                let liok = {
                                    nombre: "registro de comprobante",
                                    nivel: 1,
                                    estado: true,
                                    usuarioId: usuarioId,
                                    comprobanteId: xComprobante.id
                                }
                                ProcesoService.setAdd(liok)
                                .then((xproceso)=>{                                                              
                                    resolve({message: 'ok'})                                         
                                })
                            })
                            .catch((reason)  => reject({ message: reason.message }))
                        })             

                })               
            
            .catch((reason)  => reject({ message: reason.message })) 
           
    })
})
 
}

static regComprobanteVenta(monto, contado, banco, inicial,cuota,tipoComprobante,usuarioId,cliente,observaciones)
{  
    return new Promise((resolve,reject) =>{          
        let fechaGeneral = new Date()            
        let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = fechaGeneral.getFullYear()
        TdcService.verificar()
            .then((xtdc)=>{                    
                    ComprobanteService.getLastItem(tipoComprobante,fechaAnio)
                        .then((yx)=>{          
                            let nncc = yx ? parseInt(yx.numComprobante) + 1 : 1               
                            const iok={
                                fechaComprobante: fechaHoy,              
                                estado: 'transcripción',
                                label: cliente,
                                numComprobante: nncc,
                                glosaComprobante: observaciones,
                                montoImpuesto: 0,
                                montoSubtotal: 0,
                                montoTotal: monto,
                                tipoComprobante: tipoComprobante,
                                gestion: fechaAnio,
                                tdc: parseFloat(xtdc.monto),
                                tDebe: parseFloat(monto),
                                tHaber: parseFloat(monto),
                                usuarioId: usuarioId            
                            }

                    ComprobanteService.setAdd(iok)
                        .then((xComprobante) => {
                            let items = regVentaXP(monto, contado, banco, inicial,cuota,xComprobante.id)
                            AsientoService.setAdd(items)
                            .then((iok)=>{
                                let liok = {
                                    nombre: "registro de comprobante",
                                    nivel: 1,
                                    estado: true,
                                    usuarioId: usuarioId,
                                    comprobanteId: xComprobante.id
                                }
                                ProcesoService.setAdd(liok)
                                .then((xproceso)=>{                                                              
                                    resolve({message: 'ok'})                                         
                                })
                            })
                            .catch((reason)  => reject({ message: reason.message }))
                        })             

                })               
            
            .catch((reason)  => reject({ message: reason.message })) 
           
        })
        
    })
  }


}

function regVentaXP(monto,contado,banco,inicial,cuota,comprobanteId){
    let asientos = []
    if(contado){
        if(banco){
            asientos = regVentaContBN(monto,comprobanteId)
        }else{
            asientos = regVentaContMN(monto,comprobanteId)
        }
    }
    else{
        if(inicial){
            if(banco){
                asientos = regVentaCreInME(monto,cuota,comprobanteId)
            }else{
                asientos = regVentaCreInMN(monto,cuota,comprobanteId)
            }
        }else{
           asientos = regVentaCre(monto,comprobanteId)     
        }
    }

    return asientos

}

function regCompraXP(monto,contado,banco,inicial,cuota,comprobanteId){
    let asientos = []
    if(contado){
        if(banco){
            asientos = regCompraContBN(monto,comprobanteId)
        }else{
            asientos = regCompraContMN(monto,comprobanteId)
        }
    }
    else{
        if(inicial){
            if(banco){
                asientos = regCompraCreInME(monto,cuota,comprobanteId)
            }else{
                asientos = regCompraCreInMN(monto,cuota,comprobanteId)
            }
        }else{
           asientos = regCompraCre(monto,comprobanteId)     
        }
    }

    return asientos

}

function regPagoXP(efectivo,monto,comprobanteId,compra){
    let asientos = []
    if(compra){
        if(efectivo)
        {
            asientos = regPagoCompraMN(monto,comprobanteId)
        }else{
            asientos = regPagoCompraME(monto,comprobanteId)
        }        
    }
    else{
        if(efectivo)
        {
            asientos = regPagoVentaMN(monto,comprobanteId)
        }else{
            asientos = regPagoVentaME(monto,comprobanteId)
        }
        
    }

    return asientos
}

/************************************************** */
function regVentaContMN(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]     

    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 577,
        comprobanteId  : comprobanteId,
        codigo         : '11101', 
        descripcion    : 'CAJA MONEDA NACIONAL',                        
        debe           : parseFloat(monto) - (parseFloat(monto) * 0.03),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 474,
        comprobanteId  : comprobanteId,
        codigo         : '7210901', 
        descripcion    : 'IMPUESTO A LAS TRANSACCIONES',                        
        debe           : parseFloat(monto) * 0.03,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 296,
        comprobanteId  : comprobanteId,
        codigo         : '41101', 
        descripcion    : 'VENTAS',                        
        debe           : 0.00,
        haber          : parseFloat(monto) - (parseFloat(monto) * 0.13),
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 215,
        comprobanteId  : comprobanteId,
        codigo         : '21402', 
        descripcion    : 'DEBITO FISCAL',                        
        debe           : 0.00,
        haber          : parseFloat(monto) * 0.13,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);   
    
    return asientos

}
function regVentaContBN(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 12,
        comprobanteId  : comprobanteId,
        codigo         : '11104', 
        descripcion    : 'BANCOS MONEDA NACIONAL',                        
        debe           : parseFloat(monto) - (parseFloat(monto) * 0.03),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 474,
        comprobanteId  : comprobanteId,
        codigo         : '7210901', 
        descripcion    : 'IMPUESTO A LAS TRANSACCIONES',                        
        debe           : parseFloat(monto) * 0.03,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 296,
        comprobanteId  : comprobanteId,
        codigo         : '41101', 
        descripcion    : 'VENTAS',                        
        debe           : 0.00,
        haber          : parseFloat(monto) - (parseFloat(monto) * 0.13),
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 215,
        comprobanteId  : comprobanteId,
        codigo         : '21402', 
        descripcion    : 'DEBITO FISCAL',                        
        debe           : 0.00,
        haber          : parseFloat(monto) * 0.13,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);   
    
    return asientos

}
function regVentaCreInMN(monto,inicial,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 577,
        comprobanteId  : comprobanteId,
        codigo         : '11101', 
        descripcion    : 'CAJA MONEDA NACIONAL',                        
        debe           : parseFloat(inicial)  - (parseFloat(inicial) * 0.03),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);    
    itemAsiento = {}
    itemAsiento = {
        pucId          : 70,
        comprobanteId  : comprobanteId,
        codigo         : '11210', 
        descripcion    : 'CUENTAS POR COBRAR',                        
        debe           : (parseFloat(monto) - parseFloat(inicial))  - ((parseFloat(monto) - parseFloat(inicial)) * 0.03),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 474,
        comprobanteId  : comprobanteId,
        codigo         : '7210901', 
        descripcion    : 'IMPUESTO A LAS TRANSACCIONES',                        
        debe           : parseFloat(monto) * 0.03,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 296,
        comprobanteId  : comprobanteId,
        codigo         : '41101', 
        descripcion    : 'VENTAS',                        
        debe           : 0.00,
        haber          : parseFloat(monto) - (parseFloat(monto) * 0.13),
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 215,
        comprobanteId  : comprobanteId,
        codigo         : '21402', 
        descripcion    : 'DEBITO FISCAL',                        
        debe           : 0.00,
        haber          : parseFloat(monto) * 0.13,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);   
    
    return asientos

}
function regVentaCreInME(monto,inicial,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 12,
        comprobanteId  : comprobanteId,
        codigo         : '11104', 
        descripcion    : 'BANCOS MONEDA NACIONAL',                        
        debe           : parseFloat(inicial)  - (parseFloat(inicial) * 0.03),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);    
    itemAsiento = {}
    itemAsiento = {
        pucId          : 70,
        comprobanteId  : comprobanteId,
        codigo         : '11210', 
        descripcion    : 'CUENTAS POR COBRAR',                        
        debe           : (parseFloat(monto) - parseFloat(inicial))  - ((parseFloat(monto) - parseFloat(inicial)) * 0.03),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 474,
        comprobanteId  : comprobanteId,
        codigo         : '7210901', 
        descripcion    : 'IMPUESTO A LAS TRANSACCIONES',                        
        debe           : parseFloat(monto) * 0.03,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 296,
        comprobanteId  : comprobanteId,
        codigo         : '41101', 
        descripcion    : 'VENTAS',                        
        debe           : 0.00,
        haber          : parseFloat(monto) - (parseFloat(monto) * 0.13),
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 215,
        comprobanteId  : comprobanteId,
        codigo         : '21402', 
        descripcion    : 'DEBITO FISCAL',                        
        debe           : 0.00,
        haber          : parseFloat(monto) * 0.13,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);   
    
    return asientos

}

function regVentaCre(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 70,
        comprobanteId  : comprobanteId,
        codigo         : '11210', 
        descripcion    : 'CUENTAS POR COBRAR',                        
        debe           : parseFloat(monto) - (parseFloat(monto) * 0.03),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);
    itemAsiento = {}
    itemAsiento = {
        pucId          : 474,
        comprobanteId  : comprobanteId,
        codigo         : '7210901', 
        descripcion    : 'IMPUESTO A LAS TRANSACCIONES',                        
        debe           : parseFloat(monto) * 0.03,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);
    itemAsiento = {}
    itemAsiento = {
        pucId          : 296,
        comprobanteId  : comprobanteId,
        codigo         : '41101', 
        descripcion    : 'VENTAS',                        
        debe           : 0.00,
        haber          : parseFloat(monto) - (parseFloat(monto) * 0.13),
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 215,
        comprobanteId  : comprobanteId,
        codigo         : '21402', 
        descripcion    : 'DEBITO FISCAL',                        
        debe           : 0.00,
        haber          : parseFloat(monto) * 0.13,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);   
    return asientos

}

function regPagoVentaMN(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 577,
        comprobanteId  : comprobanteId,
        codigo         : '11101', 
        descripcion    : 'CAJA MONEDA NACIONAL',                        
        debe           : parseFloat(monto),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 70,
        comprobanteId  : comprobanteId,
        codigo         : '11201', 
        descripcion    : 'CUENTAS POR COBRAR',                        
        debe           : 0.00,
        haber          : parseFloat(monto),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);   
    return asientos

}

function regPagoVentaME(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 12,
        comprobanteId  : comprobanteId,
        codigo         : '11104', 
        descripcion    : 'BANCOS MONEDA NACIONAL',                          
        debe           : parseFloat(monto),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 70,
        comprobanteId  : comprobanteId,
        codigo         : '11201', 
        descripcion    : 'CUENTAS POR COBRAR',                        
        debe           : 0.00,
        haber          : parseFloat(monto),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);   
    return asientos

}


/********************COMPRAS************************* */

function regPagoCompraMN(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 189,
        comprobanteId  : comprobanteId,
        codigo         : '21101', 
        descripcion    : 'CUENTAS POR PAGAR',                        
        debe           : parseFloat(monto),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 577,
        comprobanteId  : comprobanteId,
        codigo         : '11101', 
        descripcion    : 'CAJA MONEDA NACIONAL',                        
        debe           : 0.00,
        haber          : parseFloat(monto),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);   
    return asientos

}

function regPagoCompraME(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 189,
        comprobanteId  : comprobanteId,
        codigo         : '21101', 
        descripcion    : 'CUENTAS POR PAGAR',                        
        debe           : parseFloat(monto),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 12,
        comprobanteId  : comprobanteId,
        codigo         : '11104', 
        descripcion    : 'BANCOS MONEDA NACIONAL',                        
        debe           : 0.00,
        haber          : parseFloat(monto),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);   
    return asientos

}

function regCompraContMN(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 77,
        comprobanteId  : comprobanteId,
        codigo         : '11301', 
        descripcion    : 'EXISTENCIAS DE MERCADERIAS',                        
        debe           : parseFloat(monto) - (parseFloat(monto) * 0.13),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 72,
        comprobanteId  : comprobanteId,
        codigo         : '1121002', 
        descripcion    : 'CREDITO FISCAL',                        
        debe           : parseFloat(monto) * 0.13,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 577,
        comprobanteId  : comprobanteId,
        codigo         : '11101', 
        descripcion    : 'CAJA MONEDA NACIONAL',                        
        debe           : 0.00,
        haber          : parseFloat(monto),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);
    return asientos

}
function regCompraContBN(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 77,
        comprobanteId  : comprobanteId,
        codigo         : '11301', 
        descripcion    : 'EXISTENCIAS DE MERCADERIAS',                        
        debe           : parseFloat(monto) - (parseFloat(monto) * 0.13),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 72,
        comprobanteId  : comprobanteId,
        codigo         : '1121002', 
        descripcion    : 'CREDITO FISCAL',                        
        debe           : parseFloat(monto) * 0.13,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 12,
        comprobanteId  : comprobanteId,
        codigo         : '11104', 
        descripcion    : 'BANCOS MONEDA NACIONAL',                        
        debe           : 0.00,
        haber          : parseFloat(monto),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);
    return asientos

}

function regCompraCre(monto,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 77,
        comprobanteId  : comprobanteId,
        codigo         : '11301', 
        descripcion    : 'EXISTENCIAS DE MERCADERIAS',                        
        debe           : parseFloat(monto) - (parseFloat(monto) * 0.13),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);
    itemAsiento = {}
    itemAsiento = {
        pucId          : 72,
        comprobanteId  : comprobanteId,
        codigo         : '1121002', 
        descripcion    : 'CREDITO FISCAL',                        
        debe           : parseFloat(monto) * 0.13,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);
    itemAsiento = {}
    itemAsiento = {
        pucId          : 189,
        comprobanteId  : comprobanteId,
        codigo         : '21101', 
        descripcion    : 'CUENTAS POR PAGAR',                        
        debe           : 0.00,
        haber          : parseFloat(monto),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);
    return asientos

}

function regCompraCreInMN(monto,inicial,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 77,
        comprobanteId  : comprobanteId,
        codigo         : '11301', 
        descripcion    : 'EXISTENCIAS DE MERCADERIAS',                        
        debe           : parseFloat(monto) - (parseFloat(monto) * 0.13),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 72,
        comprobanteId  : comprobanteId,
        codigo         : '1121002', 
        descripcion    : 'CREDITO FISCAL',                        
        debe           : parseFloat(monto) * 0.13,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 577,
        comprobanteId  : comprobanteId,
        codigo         : '11101', 
        descripcion    : 'CAJA MONEDA NACIONAL',                        
        debe           : 0.00,
        haber          : parseFloat(inicial),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 189,
        comprobanteId  : comprobanteId,
        codigo         : '21101', 
        descripcion    : 'CUENTAS POR PAGAR',                        
        debe           : 0.00,
        haber          : parseFloat(monto) - parseFloat(inicial),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);
    return asientos

}

function regCompraCreInME(monto,inicial,comprobanteId){
    let fechaGeneral = new Date()            
    let fechaHoy     = (new Date(fechaGeneral + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]
    let asientos = []
    let itemAsiento = {}
    itemAsiento = {
        pucId          : 77,
        comprobanteId  : comprobanteId,
        codigo         : '11301', 
        descripcion    : 'EXISTENCIAS DE MERCADERIAS',                        
        debe           : parseFloat(monto) - (parseFloat(monto) * 0.13),
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 72,
        comprobanteId  : comprobanteId,
        codigo         : '1121002', 
        descripcion    : 'CREDITO FISCAL',                        
        debe           : parseFloat(monto) * 0.13,
        haber          : 0.00,
        fechaAsiento   : fechaHoy
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 12,
        comprobanteId  : comprobanteId,
        codigo         : '11104', 
        descripcion    : 'BANCOS MONEDA NACIONAL',                        
        debe           : 0.00,
        haber          : parseFloat(inicial),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);

    itemAsiento = {}
    itemAsiento = {
        pucId          : 189,
        comprobanteId  : comprobanteId,
        codigo         : '21101', 
        descripcion    : 'CUENTAS POR PAGAR',                        
        debe           : 0.00,
        haber          : parseFloat(monto) - parseFloat(inicial),
        fechaAsiento   : fechaHoy        
    }
    asientos.push(itemAsiento);
    return asientos

}


export default ComprobanteController;
