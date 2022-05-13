import NotaCobranzaService from "../services/NotaCobranzaService";
import PlanService from "../services/PlanService";
import ComprobanteController from "../controllers/ComprobanteController"
class NotaController { 
    
    static getCobros(req, res) { 
        let d = new Date()
        let fpago  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]                                  
        PlanService.getCobros(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((data) => {                
                 let resData = data.data.map((item,index)=>{
                    let iok = {
                        "id"          : item.id,   
                        "cuota"       : item.cuota,
                        "monto"       : item.monto,                        
                        "fechaPago"   : item.fechaPago,                                                                        
                        "estado"      : fpago > item.fechaPago ? "vencido": "pendiente",
                        "notaId"      : item.nota.id,
                        "ventaId"     : item.nota.ventaId,
                        "glosa"       : item.nota.detalle,
                        "est"         : item.estado
                    }
                return iok;
                })
                res.status(200).send({message:"cobros lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
                
                })                   
                .catch((reason) => {   
                   
                  res.status(400).send({ message: reason });
                });         
          }
    
    static getPagos(req, res) {   
        let d = new Date()
        let fpago  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        PlanService.getPagos(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((data) => {                    
                let resData = data.data.map((item,index)=>{                                                                              
                    let iok = {
                        "id"          : item.id,   
                        "cuota"       : item.cuota,
                        "monto"       : item.monto,                        
                        "fechaPago"   : item.fechaPago,                                                                        
                        "estado"      : item.estado ? "cerrado": (fpago > item.fechaPago ? "vencido": "en fecha"),
                        "notaId"      : item.nota.id,
                        "compraId"    : item.nota.compraId,
                        "glosa"       : item.nota.detalle,
                        "est"         : item.estado
                    }
                return iok;
                })
                res.status(200).send({message:"pagos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });                      
                })                   
                .catch((reason) => {   
                            
                  res.status(400).send({ message: reason });
                });         
    }  

    static pagarCompra(req, res) {                           
        const { cuota, compraId, planId, monto, usuarioId, proveedor, observaciones, efectivo,banco, cheque } = req.body
   
        let d = new Date()
        let fpago  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]    
        var fGestion = d.getFullYear()                            
        const xpago = {
            monto : monto,
            estado: true,
            fechaPagado : fpago
        }
        
        const xcuota = cuota === 1 ? 1:cuota - 1
        NotaCobranzaService.getItem('compraId',compraId,true)
        .then((xnota)=>{                  
            if(xcuota === 1){
                PlanService.setUpdate(xpago,planId)
                 .then((xplan)=>{
                    let nok = xnota
                    nok.pagoTotal = parseFloat(nok.pagoTotal) + parseFloat(monto)
                    nok.saldoTotal = parseFloat(nok.saldoTotal) - parseFloat(monto)                    
                    NotaCobranzaService.setUpdate(nok,xnota.id)                    
                    .then((xx)=>{   
                        Promise.all([
                                NotaCobranzaService.getKey('id',xnota.id),
                                PlanService.getItems(xnota.id),
                                ComprobanteController.regPagoAut(monto,'Egreso',usuarioId,proveedor,observaciones,efectivo,banco,cheque)
                               ])    
                           .then(([item,items,iko])=>{
                              
                                res.status(200).send({message:"pago realizado", result: {item, items } });      
                            })                               
                    
                            .catch((reason) => {              
                                console.log(reason)
                                res.status(400).send({ message: reason });
                            });

                        })                       
                    })          
            }else{                                     
                PlanService.getKey(xnota.id,xcuota)
                .then((yplan)=>{                    
                    if(yplan.estado === true ){
                        PlanService.setUpdate(xpago,planId)
                            .then((xplan)=>{
                                let nok = xnota
                                nok.pagoTotal = parseFloat(nok.pagoTotal) + parseFloat(monto)
                                nok.saldoTotal = parseFloat(nok.saldoTotal) - parseFloat(monto)                    
                                NotaCobranzaService.setUpdate(nok,xnota.id)                    
                                .then((xx)=>{                        
                                    Promise.all([
                                        NotaCobranzaService.getKey('id',xnota.id),
                                        PlanService.getItems(xnota.id),
                                        ComprobanteController.regPagoAut(monto,'Egreso',usuarioId,proveedor,observaciones,efectivo,banco,cheque)
                                    ])
                                    .then(([item,items,iok])=>{
                                        res.status(200).send({message:"pago realizado", result: {item, items } });      
                                    })
                                })
                            })                                             
                    }else{
                      res.status(400).send({message:"tiene la cuota nro ("+ xcuota +") pendiente" });  
                    }
                })
                .catch((reason) => { 
                              
                    res.status(400).send({ message: reason });
                });
            }
        })
        .catch((reason) => { 
                     
            res.status(400).send({ message: reason });
        });           
    }  

    static pagarVenta(req, res) {                                   
        const { cuota, ventaId, planId, monto, usuarioId, cliente, observaciones, efectivo,banco, cheque } = req.body
        
        let d = new Date()
        let fpago  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]                               
        const xpago = {
            monto : monto,
            estado: true,
            fechaPagado : fpago        
        }
        
        const xcuota = cuota === 1 ? 1:cuota - 1
        NotaCobranzaService.getItem('ventaId',ventaId,true)
        .then((xnota)=>{                          
            if(xcuota === 1){
                PlanService.setUpdate(xpago,planId)
                 .then((xplan)=>{
                    let nok = xnota
                    nok.pagoTotal = parseFloat(nok.pagoTotal) + parseFloat(monto)
                    nok.saldoTotal = parseFloat(nok.saldoTotal) - parseFloat(monto)                    
                    NotaCobranzaService.setUpdate(nok,xnota.id)                    
                    .then((xx)=>{                        
                        Promise.all([
                            NotaCobranzaService.getKey('id',xnota.id),
                            PlanService.getItems(xnota.id),
                            ComprobanteController.regPagovAut(monto,'Ingreso',usuarioId,cliente,observaciones,efectivo,banco,cheque)
                        ])
                        .then(([item,items,iok])=>{
                            res.status(200).send({message:"pago realizado", result: {item, items } });                              
                        })
                        .catch((reason) => {              
                         
                            res.status(400).send({ message: reason });
                        });
                    })
                })
            }else{               
         
                PlanService.getKey(xnota.id,xcuota)
                .then((yplan)=>{                    
                    if(yplan.estado === true ){
                        PlanService.setUpdate(xpago,planId)
                            .then((xplan)=>{
                                let nok = xnota
                                nok.pagoTotal = parseFloat(nok.pagoTotal) + parseFloat(monto)
                                nok.saldoTotal = parseFloat(nok.saldoTotal) - parseFloat(monto)                    
                                NotaCobranzaService.setUpdate(nok,xnota.id)                    
                                .then((xx)=>{                        
                                    Promise.all([
                                        NotaCobranzaService.getKey('id',xnota.id),
                                        PlanService.getItems(xnota.id),
                                        ComprobanteController.regPagovAut(monto,'Ingreso',usuarioId,cliente,observaciones,efectivo,banco,cheque)
                                    ])
                                    .then(([item,items,iok])=>{
                                        res.status(200).send({message:"pago realizado", result: {item, items } });                              
                                    })
                                })
                            })                                             
                    }else{
                      res.status(400).send({message:"tiene la cuota nro ("+ xcuota +") pendiente" });  
                    }
                })
                .catch((reason) => { 
                              
                    res.status(400).send({ message: reason });
                });

            }
        })
        .catch((reason) => { 
                     
            res.status(400).send({ message: reason });
        }); 

    }

    static searchPagos(req, res) {   
        let d = new Date()
        let fpago  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        const { prop, value } = req.body       
        
        PlanService.searchPagos(1,15,prop,value)
            .then((data) => {                        
                let resData = data.data.map((item,index)=>{
                    let iok = {
                        "id"          : item.id,   
                        "cuota"       : item.cuota,
                        "monto"       : item.monto,                        
                        "fechaPago"   : item.fechaPago,                                                                        
                        "estado"      : item.estado ? "cerrado": (fpago > item.fechaPago ? "vencido": "en fecha"),
                        "notaId"      : item.nota.id,
                        "compraId"    : item.nota.compraId,
                        "glosa"       : item.nota.detalle,
                        "est"         : item.estado
                    }
                return iok;
                })
                res.status(200).send({message:"pagos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });                      
                })                   
                .catch((reason) => {   
                         
                  res.status(400).send({ message: reason });
                });         
    }
    static searchCobros(req, res) {   
        let d = new Date()
        let fpago  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        const { prop, value } = req.body       
        
        PlanService.searchCobros(1,15,prop,value)
            .then((data) => {                        
                let resData = data.data.map((item,index)=>{
                    let iok = {
                        "id"          : item.id,   
                        "cuota"       : item.cuota,
                        "monto"       : item.monto,                        
                        "fechaPago"   : item.fechaPago,                                                                        
                        "estado"      : fpago > item.fechaPago ? "vencido": "pendiente",
                        "notaId"      : item.nota.id,
                        "ventaId"     : item.nota.ventaId,
                        "glosa"       : item.nota.detalle,
                        "est"         : item.estado
                    }
                return iok;
                })
                res.status(200).send({message:"cobros lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });                      
                })                   
                .catch((reason) => {   
                             
                  res.status(400).send({ message: reason });
                });         
    } 
    
}

export default NotaController;
