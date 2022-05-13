import AlmacenItemsService from "../services/AlmacenItemsService"
import NotaCobranzaService from "../services/NotaCobranzaService"
import PlanService from "../services/PlanService"
import ComprobanteController from "./ComprobanteController";
import TdcService from "../services/TdcService"
import MovimientoService from "../services/MovimientoService"
import MovimientoItemService from "../services/MovimientoItemService"

class MovimientoController { 

      /**Data Movimientos */
      static getData(req, res) {               
        MovimientoService.getData(req.params.pagina,req.params.num,'movimiento')
            .then((data) => {                                                                         
              res.status(200).send({message:"movimientos lista", result: data });            
            })                   
            .catch((reason) => { 
                console.log(reason)                     
              res.status(400).send({ message: reason });
            });         
    }

    /** Crear Cormpra **/
    static crear(req, res) {   
        const { item, items } = req.body 
        console.log(item)
        let d = new Date()
        let fechaMovimiento  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = d.getFullYear()
        let fechaMes     = d.getMonth() + 1

        //crear la movimiento tipo pedido , estado pendiente
        let newItem = item
        newItem.fecha      = fechaMovimiento
        newItem.estado     = 'pendiente'
        newItem.nroPagos   = 0        
        newItem.gestion    = fechaAnio
        newItem.mes        = fechaMes
        newItem.destinoId  = item.tipo === 'Baja' ? 100: item.destinoId 
        newItem.destino    = item.tipo === 'Baja' ? 'Descarte': item.destino 


        MovimientoService.setAdd(newItem)
            .then((xitem)=>{                
                //creamos items vinculados a la movimiento
                let newItems = items.map((it,index)=>{
                    let iok = {
                        "movimientoId"   : xitem,
                        "cantidad"   : it.cantidad,  
                        "codigo"     : it.codigo,
                        "valor"      : parseFloat(it.valor),                        
                        "articuloId" : it.articuloId,
                        "gestion"    : fechaAnio,
                        "mes"        : fechaMes,
                        "subTotal"   : it.subTotal
                    }
                    return iok;
                })
                MovimientoItemService.setAdd(newItems)
                    .then((yitem)=>{
                        Promise.all([MovimientoService.getItemSingle(xitem),MovimientoItemService.getItems(xitem)])
                          .then(([item, xitems])=>{
                            let items = xitems.map((it,index)=>{
                                let eok = {
                                    "articuloId" : it.articuloId,
                                    "valor"      : it.valor,                                    
                                    "movimientoId"   : it.movimientoId,                                                                                                          
                                    "cantidad"   : it.cantidad,
                                    "nombre"     : it.articulo.nombre,
                                    "codigo"     : it.articulo.codigo
                                }
                                return eok;
                            })
                            res.status(200).send({message:"movimientos creada", result: { item, items }});
                          }) 
                          .catch((reason) => {  
                            console.log(reason)
                            res.status(400).send({ message: reason });
                          });
                    })
                    .catch((reason) => {   
                        console.log(reason)                         
                        res.status(400).send({ message: reason });
                    });
                })
            .catch((reason) => {   
                console.log(reason)                         
                res.status(400).send({ message: reason });
            }); 

    }
    /** Actualizar Cormpra **/
    static actualizar(req, res) {       
        const { item, items } = req.body     
        console.log(item)                             
          MovimientoItemService.delete(item.id)
            .then((yitems) => {                                                         
                Promise.all([MovimientoItemService.setAdd(items),MovimientoService.setUpdate(item,item.id)])
                   .then((umovimiento,uitems)=>{
                        Promise.all([MovimientoService.getItemSingle(item.id),MovimientoItemService.getItems(item.id)])
                                .then(([item, xitems]) =>{               
                                    let items = xitems.map((it,index)=>{
                                        let eok = {
                                            "articuloId" : it.articuloId,
                                            "valor"      : it.valor,    
                                            "subTotal"   : it.subTotal,                                
                                            "movimientoId"   : it.movimientoId,                                            
                                            "cantidad"   : it.cantidad,
                                            "nombre"     : it.articulo.nombre,
                                            "codigo"     : it.articulo.codigo
                                        }
                                        return eok;
                                    })
                                    res.status(200).send({message:"movimientos lista", result: {item, items }});
                                }) 
                    }) 
                    .catch((reason) => {  
                       res.status(400).send({ message: reason });
                    });
            })                   
            .catch((reason) => {                       
              res.status(400).send({ message: reason });
            });         
    }
    /** Buscar Cormpra **/
    static search(req, res) {  
        const { prop, value, usuarioId, rolId } = req.body        
        MovimientoService.search(prop,value,usuarioId,rolId,'movimiento')
            .then((data)=>{
                let resData = data.data.map((item,index)=>{
                    let iok = {
                    "id"            : item.id,   
                    "fechaMovimiento"   : item.fechaMovimiento,
                    "tipo"          : item.tipo,
                    "totalGeneral"  : item.totalGeneral,
                    "observaciones" : item.observaciones,
                    "estado"        : item.estado,
                    "totalGeneral"  : item.totalGeneral                  
                    }
                return iok;
                })  
                res.status(200).send({message:"movimientos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
            })                  
            .catch((reason) => {                            
              res.status(400).send({ message: reason });
            });         
    }
    
  
    /** Borra Movimiento */
    static borrar(req, res) {     
        const { usuarioId, rolId } = req.body                                
        MovimientoItemService.delete(req.params.id)
          .then((yitems)=>{                                                  
             MovimientoService.delete(req.params.id)
                .then((yitem)=>{
                    MovimientoService.getData(1,15,'movimiento')
                       .then((data)=>{
                        res.status(200).send({message:"movimientos lista", result: data });
                    })
                })
            })                 
           .catch((reason) => {                          
              res.status(400).send({ message: reason });
           });         
    }

    /** Resumen Movimientos */
    static resumen(req, res) {   
        //Mostrar Movimiento
        MovimientoService.getItemSingle(req.params.id)
            .then((xitem)=>{
                if(xitem.estado === "cerrado")
                {
                 Promise.all([MovimientoService.getItem(req.params.id),MovimientoItemService.getItems(req.params.id)])   
                   .then(([item,data])=>{
                        let items = data.map((item,index)=>{
                            let iok = {
                            "id"           : item.id,   
                            "cantidad"     : item.cantidad,
                            "valor"        : item.valor,                                  
                            "unidad"       : item.unidad,          
                            "articuloId"   : item.articuloId,                                                                      
                            "nombre"       : item.articulo.nombre,                        
                            "codigo"       : item.articulo.codigo,                                 
                            "movimientoId" : item.movimientoId,              
                            "nombreCorto"  : item.articulo.nombreCorto
                            }
                        return iok;
                        })                             
                        
                        res.status(200).send({message:"movimiento resumen", result: {item, items }});    
                        
                   })
                   .catch((reason) => {
                    console.log(reason)
                    res.status(400).send({ message: reason });
                   }); 
                }else{
                    Promise.all([MovimientoService.getItem(req.params.id),MovimientoItemService.getItems(req.params.id)])   
                    .then(([item,data])=>{
                         let items = data.map((item,index)=>{
                             let iok = {
                             "id"           : item.id,   
                             "cantidad"     : item.cantidad,
                             "valor"        : item.valor,                                    
                             "unidad"       : item.unidad,                   
                             "articuloId"   : item.articuloId,                                                                      
                             "nombre"       : item.articulo.nombre,                        
                             "codigo"       : item.articulo.codigo,     
                             "movimientoId" : item.movimientoId,              
                             "nombreCorto"  : item.articulo.nombreCorto
                             }
                         return iok;
                         })                             
                         
                        res.status(200).send({message:"movimiento resumen", result: {item, items }});    
                         
                    }) 
                    .catch((reason) => {
                        console.log(reason)
                        res.status(400).send({ message: reason });
                    });
                }
            })
            .catch((reason) => {
               console.log(reason)
               res.status(400).send({ message: reason });
            });
        
    }

    /** Aprobar Movimiento */    
    static aprobar(req, res) {          
      let d = new Date()
      let fechaMovimiento  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]      
      var fechaGestion = d.getFullYear()
      var fechaMes     = d.getMonth() + 1
      const { item, total } = req.body    
      
      Promise.all([MovimientoService.getItem(item.id), MovimientoItemService.getItems(item.id)]) 
        .then(([xmovimiento,xitems])=>{
                     
            //descontar almacen1            
            xitems.map(it=>{   
                         
                AlmacenItemsService.verificar(it.articuloId,xmovimiento.origenId)
                .then((xite)=>{                                     
                    if(xite)
                    {
                        let dt = xite
                            dt.stock = xite.stock - it.cantidad
                            dt.valor = parseFloat(xite.valor) - parseInt(it.valor)                            
                            AlmacenItemsService.setUpdate(dt,xite.id)
                                .then((iok)=>{ console.log('actualizado')}) 
                    }       
                })
                .catch((reason) => { 
                    console.log(reason)               
                    reject({ message: reason.message })
                  });  
                return; 
            })
            //aumentar almacen1
            xitems.map(it=>{
                AlmacenItemsService.verificar(it.articuloId,xmovimiento.destinoId)
                .then((xite)=>{                    
                    if(!xite)
                    {
                        let dt = {
                            articuloId  : it.articuloId,
                            almacenId   : xmovimiento.destinoId,
                            stock       : it.cantidad,
                            valor       : parseFloat(it.valor) * parseFloat(it.cantidad),
                            categoriaId : it.articulo.categoriaId,       
                            costo       : it.costo                       
                            }
                            AlmacenItemsService.setAdd(dt)
                                .then((iok)=>{ console.log('creado')}) 
                    }else{
                        let dt = xite
                            dt.stock = parseInt(xite.stock) + parseInt(it.cantidad)
                            dt.valor = parseInt(dt.stock) * parseFloat(it.valor)                             
                            AlmacenItemsService.setUpdate(dt,xite.id)
                                .then((iok)=>{console.log('actualizado')})
                    }
                })
                .catch((reason) => { 
                    console.log(reason)               
                    reject({ message: reason.message })
                  }); 
                return; 
            })      
          
           
            
            //Update Compra
            let newMov = xmovimiento
            newMov.estado = "cerrado"                       
                MovimientoService.setUpdate(newMov,xmovimiento.id)
                    .then((xxmov)=>{
                        MovimientoService.getData(1,15)
                        .then((data)=>{
                            res.status(200).send({message:"movimientos lista", result: data });
                        })        
                        .catch((reason) => {
                            console.log(reason)
                            res.status(400).send({ message: reason });
                         });
                    })
                    .catch((reason) => {
                        console.log(reason)
                        res.status(400).send({ message: reason });
                     });

        })
        .catch((reason) => {
            console.log(reason)
            res.status(400).send({ message: reason });
         });

    }  

    
    



      
    
}


export default MovimientoController;
