import CotizacionService from "../services/CotizacionService";
import CotizacionItemsService from "../services/CotizacionItemsService";
import AlmacenItemsService from "../services/AlmacenItemsService"

class CotizacionController { 

    static getItems(req, res) {                   
        CotizacionService.getItems(req.params.prop,req.params.orden)
            .then((cotizaciones) => {                
                res.status(200).send({message:"cotizaciones lista", result: cotizaciones });
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 

    static resumen(req, res) {               
        Promise.all([
            CotizacionService.getItem(req.params.id),
            CotizacionItemsService.getItems(req.params.id)            
            ])
          .then(([item,data]) => {                              
                let items = data.map((item,index)=>{
                    let iok = {
                    "id"           : item.id,   
                    "cantidad"     : item.cantidad,
                    "valor"        : item.valor,      
                    "subTotal"     : item.subTotal,           
                    "articuloId"   : item.articuloId,                                                                      
                    "nombre"       : item.articulo.nombre,                                            
                    "codigo"       : item.articulo.codigo,     
                    "cotizacionId" : item.cotizacionId,              
                    "nombreCorto"  : item.articulo.nombreCorto,                   
                    "unidad"       : item.unidad
                    }
                return iok;
                })                             
              res.status(200).send({message:"cotizacion resumen", result: {item, items }});                  
           })                   
           .catch((reason) => {    
               console.log(reason)                    
              res.status(400).send({ message: reason });
           });         
    }

    static crear(req, res) {  
        const { usuarioId, rolId } = req.body             
        let d = new Date()
        let fcotizacion  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]     
        let fechaGestion = d.getFullYear()      
        let xiok = {
            fechaCotizacion : fcotizacion,      
            estado          : "pendiente",      
            clients         : "sin cliente",
            observaciones   : "cotizacion nueva - sin items",               
            usuarioId       : usuarioId,
            rolId           : rolId,
            nroItems        : 0,
            total           : 0,
            clienteId       : 1,
            gestion         : fechaGestion,
            iva             :0,
            subTotal        : 0,
            totalGeneral    : 0,
            impuesto        : 0                 
        }
        CotizacionService.setAdd(xiok)
            .then((cotizacion) => {                                  
                CotizacionService.getData(1,15,usuarioId,rolId)
                    .then((data)=>{
                        let resData = data.data.map((item,index)=>{
                            let iok = {
                                "id"               : item.id,   
                                "fechaCotizacion"  : item.fechaCotizacion,
                                "tipo"             : item.tipo,
                                "totalGeneral"     : item.totalGeneral,
                                "observaciones"    : item.observaciones,
                                "estado"           : item.estado,
                                "cliente"          : item.cliente.nombres
                            }
                            return iok;
                            })  
                                    res.status(200).send({message:"cotizacions lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });                                              
                                })                
                                .catch((reason) => {  
                                    console.log(reason)            
                                    res.status(400).send({ message: reason });
                                });                                       

            })                   
            .catch((reason) => {  
                  
              res.status(400).send({ message: reason });
            });         
    }  

    static search(req, res) {  

        const { prop, value, usuarioId, rolId } = req.body      
        
        let oprop  = prop === "observaciones" ? value: '0'
        let iprop  = prop === "cliente" ? value: '0'     
        let dDesde = prop === "fechaCotizacion" ? (value ? new Date(value)  : '2020-01-01') : '2020-01-01'        
        let fprop  = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]        
  
        CotizacionService.search(oprop,iprop,fprop,usuarioId,rolId)
            .then((data)=>{
                let resData = data.data.map((item,index)=>{
                    let iok = {
                        "id"               : item.id,   
                        "fechaCotizacion"  : item.fechaCotizacion,
                        "tipo"             : item.tipo,
                        "totalGeneral"     : item.totalGeneral,
                        "observaciones"    : item.observaciones,
                        "estado"           : item.estado,
                        "cliente"          : item.cliente.nombres,                        
                    }
                return iok;
                })  
                res.status(200).send({message:"cotizacions lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
            })                  
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
    }
   

    static getData(req, res) {               
        CotizacionService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((data) => {                                                          
                    let resData = data.data.map((item,index)=>{
                        let iok = {
                            "id"               : item.id,   
                            "fechaCotizacion"  : item.fechaCotizacion,
                            "tipo"             : item.tipo,
                            "totalGeneral"     : item.totalGeneral,
                            "observaciones"    : item.observaciones,
                            "estado"           : item.estado,
                            "cliente"          : item.cliente.nombres                            
                        }
                    return iok;
                    })  
              res.status(200).send({message:"cotizacions lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
            })                   
            .catch((reason) => {  
                  
              res.status(400).send({ message: reason });
            });         
    }


    static actualizar(req, res) {       
        const { item, items } = req.body  
      
        let d       = new Date()
        let fcotizacion  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]                               
        CotizacionItemsService.delete(item.id)
            .then((xitems) => {       
                Promise.all([CotizacionItemsService.setAdd(items),CotizacionService.setUpdate(item,item.id)])                                  
                        .then((ucompra,uitems)=>{
                            Promise.all([CotizacionService.getItem(item.id),CotizacionItemsService.getItems(item.id)])                                
                                .then(([item, itemss]) =>{   
                                    let items = itemss.map((item,index)=>{
                                        let iok = {
                                            "id"               : item.id,   
                                            "cantidad"         : item.cantidad,      
                                            "unidad"           : item.unidad,                                      
                                            "valor"            : item.valor,
                                            "articuloId"       : item.articulo.id,
                                            "nombre"           : item.articulo.nombre,
                                            "codigo"           : item.articulo.codigo
                                        }
                                    return iok;
                                    })                                                                                             
                                    res.status(200).send({message:"cotizacions lista", result: {item, items }});
                                }) 
                            })
                    })        
                           
            .catch((reason) => {  
                   
              res.status(400).send({ message: reason });
            });         
    }

    static borrar(req, res) {   
        const { usuarioId, rolId } = req.body                                 
        CotizacionItemsService.delete(req.params.id)
            .then((yitems)=>{                                                  
                CotizacionService.delete(req.params.id)
                    .then((yitem)=>{
                        CotizacionService.getData(1,15,usuarioId, rolId)
                            .then((data)=>{
                                let resData = data.data.map((item,index)=>{
                                    let iok = {
                                    "id"               : item.id,   
                                    "fechaCotizacion"  : item.fechaCotizacion,
                                    "tipo"             : item.tipo,
                                    "totalGeneral"     : item.totalGeneral,
                                    "observaciones"    : item.observaciones,
                                    "estado"           : item.estado,
                                    "cliente"          : item.cliente.nombres                     
                                    }
                                return iok;
                                })  
                                res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
                            })
                        })             
            })                   
           .catch((reason) => {  
                      
              res.status(400).send({ message: reason });
           });         
    }

    

   

    
    
}

export default CotizacionController;
