import CompraService from "../services/CompraService";
import CompraItemsService from "../services/CompraItemsService";
import AlmacenItemsService from "../services/AlmacenItemsService"
import NotaCobranzaService from "../services/NotaCobranzaService"
import PlanService from "../services/PlanService"
import ComprobanteController from "./ComprobanteController";
import TdcService from "../services/TdcService"
import MovimientoService from "../services/MovimientoService"
import MovimientoItemService from "../services/MovimientoItemService"

class CompraController { 

    /** Crear Cormpra **/
    static crear(req, res) {   
        const { item, items } = req.body 
        let d = new Date()
        let fechaCompra  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = d.getFullYear()
        let fechaMes     = d.getMonth() + 1

        //crear la compra tipo pedido , estado pendiente
        let newItem = item
        newItem.fechaCompra = fechaCompra
        newItem.estado      = 'pendiente'
        newItem.nroPagos    = 0        
        newItem.gestion     = fechaAnio
        newItem.mes         = fechaMes
        newItem.tipo        = 'compra'
        newItem.origen      = 'compra directa'
        newItem.almacenId   = newItem.almacenId === 0 ? 1 : item.almacenId
        newItem.proveedorId = newItem.proveedorId === 0 ? 1 : item.proveedorId
        /*newItem.proveedors  = item.proveedorId === 0 ? 'Sin Proveeedor' : item.proveedors*/



        CompraService.setAdd(newItem)
            .then((xitem)=>{                
                //creamos items vinculados a la compra
                let newItems = items.map((it,index)=>{
                    let iok = {
                        "compraId"   : xitem,
                        "cantidad"   : it.cantidad,  
                        "codigo"     : it.codigo,
                        "valor"      : parseFloat(it.valor),
                        "categoria"  : it.categoria,
                        "marca"      : it.marca,
                        "articuloId" : it.articuloId,
                        "gestion"    : fechaAnio,
                        "mes"        : fechaMes,
                        "subTotal"   : it.subTotal,
                        "unidad"     : it.unidad
                    }
                    return iok;
                })
                CompraItemsService.setAdd(newItems)
                    .then((yitem)=>{
                        Promise.all([CompraService.getItemSingle(xitem),CompraItemsService.getItems(xitem)])
                          .then(([item, xitems])=>{
                            let items = xitems.map((it,index)=>{
                                let eok = {
                                    "articuloId" : it.articuloId,
                                    "valor"      : it.valor,                                    
                                    "compraId"   : it.compraId,
                                    "subTotal"   : it.subTotal,                                    
                                    "unidad"     : it.unidad,
                                    "cantidad"   : it.cantidad,
                                    "nombre"     : it.articulo.nombre,
                                    "codigo"     : it.articulo.codigo
                                }
                                return eok;
                            })
                            res.status(200).send({message:"compras creada", result: { item, items }});
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
          CompraItemsService.delete(item.id)
            .then((yitems) => {                                                         
                Promise.all([CompraItemsService.setAdd(items),CompraService.setUpdate(item,item.id)])
                   .then((ucompra,uitems)=>{
                        Promise.all([CompraService.getItemSingle(item.id),CompraItemsService.getItems(item.id)])
                                .then(([item, xitems]) =>{               
                                    let items = xitems.map((it,index)=>{
                                        let eok = {
                                            "articuloId" : it.articuloId,
                                            "valor"      : it.valor,    
                                            "subTotal"   : it.subTotal,                                
                                            "compraId"   : it.compraId,                                            
                                            "cantidad"   : it.cantidad,
                                            "nombre"     : it.articulo.nombre,
                                            "codigo"     : it.articulo.codigo,
                                            "unidad"     : it.unidad
                                        }
                                        return eok;
                                    })
                                    res.status(200).send({message:"compras lista", result: {item, items }});
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
        CompraService.search(prop,value,usuarioId,rolId,'compra')
            .then((data)=>{
                let resData = data.data.map((item,index)=>{
                    let iok = {
                    "id"            : item.id,   
                    "fechaCompra"   : item.fechaCompra,
                    "tipo"          : item.tipo,
                    "totalGeneral"  : item.totalGeneral,
                    "observaciones" : item.observaciones,
                    "estado"        : item.estado,
                    "proveedor"     : item.proveedor.razonSocial                    
                    }
                return iok;
                })  
                res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
            })                  
            .catch((reason) => {                            
              res.status(400).send({ message: reason });
            });         
    }
    
    /**Data Compras */
    static getData(req, res) {               
        CompraService.getData(req.params.pagina,req.params.num,'compra')
            .then((data) => {                                                          
                    let resData = data.data.map((item,index)=>{
                        let iok = {
                        "id"            : item.id,   
                        "fechaCompra"   : item.fechaCompra,
                        "tipo"          : item.tipo,
                        "origen"        : item.origen,
                        "nroItems"      : item.nroItems,    
                        "totalGeneral"  : item.totalGeneral,
                        "observaciones" : item.observaciones,
                        "estado"        : item.estado,
                        "proveedor"     : item.proveedor.razonSocial                       
                        }
                    return iok;
                    })  
              res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
            })                   
            .catch((reason) => {                      
              res.status(400).send({ message: reason });
            });         
    }
    /** Borra Compra */
    static borrar(req, res) {     
        const { usuarioId, rolId } = req.body                                
        CompraItemsService.delete(req.params.id)
          .then((yitems)=>{                                                  
             CompraService.delete(req.params.id)
                .then((yitem)=>{
                    CompraService.getData(1,15,'compra')
                       .then((data)=>{
                            let resData = data.data.map((item,index)=>{
                                    let iok = {
                                    "id"             : item.id,   
                                    "fechaCompra"    : item.fechaCompra,
                                    "tipo"           : item.tipo,
                                    "totalGeneral"          : item.totalGeneral,
                                    "observaciones"  : item.observaciones,
                                    "estado"         : item.estado,
                                    "proveedor"      : item.proveedor.razonSocial,            
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

    /** Resumen Compras */
    static resumen(req, res) {   
        //Mostrar Compra
        CompraService.getItemSingle(req.params.id)
            .then((xitem)=>{
                if(xitem.estado === "cerrado")
                {
                 Promise.all([CompraService.getItem(req.params.id),CompraItemsService.getItems(req.params.id),NotaCobranzaService.getKey("compraId",req.params.id)])   
                   .then(([item,data,nota])=>{
                        let items = data.map((item,index)=>{
                            let iok = {
                            "id"           : item.id,   
                            "cantidad"     : item.cantidad,
                            "valor"        : item.valor,      
                            "subTotal"     : item.subTotal,  
                            "unidad"       : item.unidad,          
                            "articuloId"   : item.articuloId,                                                                      
                            "nombre"       : item.articulo.nombre,                        
                            "codigo"       : item.articulo.codigo,                                 
                            "compraId"     : item.compraId,              
                            "nombreCorto"  : item.articulo.nombreCorto
                            }
                        return iok;
                        })                             
                        PlanService.getItems(nota.id)
                            .then((plan)=>{                        
                            res.status(200).send({message:"compra resumen", result: {item, items, nota, plan }});    
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
                }else{
                    Promise.all([CompraService.getItem(req.params.id),CompraItemsService.getItems(req.params.id)])   
                    .then(([item,data])=>{
                         let items = data.map((item,index)=>{
                             let iok = {
                             "id"           : item.id,   
                             "cantidad"     : item.cantidad,
                             "valor"        : item.valor,     
                             "subTotal"     : item.subTotal,    
                             "unidad"       : item.unidad,                   
                             "articuloId"   : item.articuloId,                                                                      
                             "nombre"       : item.articulo.nombre,                        
                             "codigo"       : item.articulo.codigo,     
                             "compraId"     : item.compraId,              
                             "nombreCorto"  : item.articulo.nombreCorto
                             }
                         return iok;
                         })                             
                         
                        res.status(200).send({message:"compra resumen", result: {item, items }});    
                         
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

    /** Aprobar Compra */    
    static aprobar(req, res) {          
      let d = new Date()
      let fechaCompra  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]      
      var fechaGestion = d.getFullYear()
      var fechaMes     = d.getMonth() + 1
      const { item, items, contado, banco, inicial,cuota,total, usuarioId } = req.body    
      console.log(item)  
        
        //Verificar TDC
        TdcService.verificar()
        .then((xtdc)=>{
           if(xtdc){
               //Crear Nota
               let xnota = {
                "tipo"             :  item.nroPagos > 1 ? "credito": "contado",
                "montoTotal"       :  item.total,
                "pagoTotal"        :  0,
                "saldoTotal"       :  item.total,
                "fechaVencimiento" :  fechaCompra,
                "cuotas"           :  item.nroPagos,       
                "compraId"         :  item.id,                
                "isVenta"          :  false,                
                "mes"              :  fechaMes,  
                "detalle"          :  "Nota de Compra Nro." + item.id 
                }    
                NotaCobranzaService.setNota(xnota)
                .then((xs)=>{
                    let xplan = items.map((it)=>{
                        const date = new Date(it.fechaPago);                          
                        let xdata={
                            cuota     : it.cuota,
                            monto     : it.monto,
                            estado    : false,
                            fechaPago : it.fechaPago,
                            notaId    : xs,
                            mes       : date.getMonth()+1,
                            gestion   : fechaGestion,
                            isVenta   : false
                        }
                        return xdata;
                    })
                    //Crear Plan
                    PlanService.setAdd(xplan)
                      .then((yplan)=>{                                                             
                        Promise.all([
                            CompraService.getItemSingle(req.params.id),
                            CompraItemsService.getList(req.params.id)])
                                .then(([xycompra,xyitems])=>{
                                             //Flow Items   
                                                xyitems.map(it=>{                                                                    
                                                  AlmacenItemsService.verificar(it.articuloId,item.almacenId)  
                                                    .then((xite)=>{                                                                                                                
                                                        if(!xite)
                                                        {
                                                            let dt = {
                                                                articuloId  : it.articuloId,
                                                                almacenId   : item.almacenId,
                                                                stock       : it.cantidad,
                                                                valor       : parseFloat(it.valor) * parseFloat(it.cantidad),
                                                                categoriaId : it.articulo.categoriaId,
                                                                costo       : parseFloat(it.valor)
                                                                }
                                                                AlmacenItemsService.setAdd(dt)
                                                                    .then((iok)=>{ console.log('creado')})                                                            
                                                        }else{
                                                            let dt = xite
                                                                dt.stock = parseInt(xite.stock) + parseInt(it.cantidad)
                                                                dt.valor = parseInt(dt.stock) * parseFloat(it.valor) 
                                                                dt.costo = parseFloat(it.valor)
                                                                AlmacenItemsService.setUpdate(dt,xite.id)
                                                                    .then((iok)=>{console.log('actualizado')})
                                                        }
                                                    })  
                                                  return;  
                                                })                                      
                                             let newCompra = xycompra
                                                 newCompra.estado          = "cerrado"
                                                 newCompra.fechaAprobacion = fechaCompra                                      
                                            Promise.all([                                                
                                                ComprobanteController.regComprobanteAut(total,contado,banco,inicial,cuota,'Egreso',xycompra.usuarioId,xycompra.proveedors,xycompra.observaciones),
                                                CompraService.setUpdate(newCompra,req.params.id)                                               
                                            ])     
                                                .then(([xcomprobante,xconta])=>{                                                   
                                                    CompraService.getData(1,15,'compra')
                                                    .then((ydata)=>{    
                                                        let resData = ydata.data.map((item,index)=>{
                                                            let iok = {
                                                            "id"             : item.id,   
                                                            "fechaCompra"    : item.fechaCompra,
                                                            "tipo"           : item.tipo,
                                                            "origen"         : item.origen,
                                                            "totalGeneral"    : item.totalGeneral,
                                                            "observaciones"  : item.observaciones,
                                                            "estado"         : item.estado,
                                                            "proveedor"      : item.proveedor.razonSocial
                                                            }
                                                        return iok;
                                                        })
                          
                                                        res.status(200).send({message:"compras lista", result: {data: resData, total: ydata.total, pagina: ydata.pagina,paginas:ydata.paginas} });     
                                                    })                                                    
                                                }) 
                                                .catch((reason) => {              
                                                    console.log(reason)           
                                                    res.status(400).send({ message: reason });
                                                });
                                             //Registro Contabilidad, muestra DATA
                                        })
                                        .catch((reason) => {              
                                            console.log(reason)           
                                            res.status(400).send({ message: reason });
                                        });
                                    //Registrar Items Almacen
                           
                        })
                        .catch((reason) => {              
                            console.log(reason)           
                            res.status(400).send({ message: reason });
                        });
                    //Crear Plan    
                })
                .catch((reason) => {              
                    console.log(reason)           
                    res.status(400).send({ message: reason });
                });
                //Fin Nota
           }else{
            res.status(400).send({ message: "No tiene registrado el tipo de cambio para hoy" }); 
           } 
        })
        .catch((reason) => {              
          console.log(reason)           
          res.status(400).send({ message: reason });
        }); 
    }  

    
    



      
    
}


export default CompraController;
