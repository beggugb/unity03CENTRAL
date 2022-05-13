import VentaService from "../services/VentaService";
import VentaItemsService from "../services/VentaItemsService";
import AlmacenItemsService from "../services/AlmacenItemsService"
import NotaCobranzaService from "../services/NotaCobranzaService"
import PlanService from "../services/PlanService"
import ComprobanteController from "./ComprobanteController";
import TdcService from "../services/TdcService"
import MovimientoService from "../services/MovimientoService"

class SolicitudController { 

     /**Data Ventas */
     static getData(req, res) {               
        VentaService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((data) => {                                                          
                    let resData = data.data.map((item,index)=>{
                        let iok = {
                        "id"             : item.id,   
                        "fechaVenta"     : item.fechaVenta,
                        "tipo"           : item.tipo,
                        "total"          : item.total,
                        "observaciones"  : item.observaciones,
                        "estado"         : item.estado,
                        "cliente"        : item.cliente.nombres,
                        "usuario"        : item.usuario.nombres
                        }
                    return iok;
                    })  
              res.status(200).send({message:"solicitudes lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
            })                   
            .catch((reason) => {                      
              res.status(400).send({ message: reason });
            });         
    }

      /** Crear Venta **/
    static crear(req, res) {   
        const { item, items } = req.body 
   
        let d = new Date()
        let fechaVenta   = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = d.getFullYear()
        let fechaMes     = d.getMonth() + 1

        //crear la venta tipo pedido , estado pendiente
        let newItem = item
        newItem.fechaVenta  = fechaVenta
        newItem.estado      = 'pendiente'
        newItem.nroPagos    = 0        
        newItem.gestion     = fechaAnio
        newItem.mes         = fechaMes

  

        VentaService.setAdd(newItem)
            .then((xitem)=>{                
                //creamos items vinculados a la venta
                let newItems = items.map((it,index)=>{
                    let iok = {
                        "ventaId"    : xitem,
                        "cantidad"   : it.cantidad,  
                        "codigo"     : it.codigo,
                        "valor"      : parseFloat(it.valor),
                        "categoria"  : it.categoria,
                        "marca"      : it.marca,
                        "articuloId" : it.articuloId,
                        "gestion"    : fechaAnio,
                        "mes"        : fechaMes
                    }
                    return iok;
                })
                VentaItemsService.setAdd(newItems)
                    .then((yitem)=>{
                        Promise.all([VentaService.getItemSingle(xitem),VentaItemsService.getItems(xitem)])
                          .then(([item, xitems])=>{
                            let items = xitems.map((it,index)=>{
                                let eok = {
                                    "articuloId" : it.articuloId,
                                    "valor"      : it.valor,                                    
                                    "ventaId"    : it.ventaId,
                                    "categoria"  : it.articulo.categoria.nombre,
                                    "marca"      : it.articulo.marca.nombre,
                                    "cantidad"   : it.cantidad,
                                    "nombre"     : it.articulo.nombre,
                                    "codigo"     : it.articulo.codigo
                                }
                                return eok;
                            })
                            res.status(200).send({message:"venta creada", result: { item, items }});
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
    /** Actualizar Venta **/
    static actualizar(req, res) {       
        const { item, items } = req.body                                  
          VentaItemsService.delete(item.id)
            .then((yitems) => {                                                         
                Promise.all([VentaItemsService.setAdd(items),VentaService.setUpdate(item,item.id)])
                   .then((ucompra,uitems)=>{
                        Promise.all([VentaService.getItemSingle(item.id),VentaItemsService.getItems(item.id)])
                                .then(([item, xitems]) =>{               
                                    let items = xitems.map((it,index)=>{
                                        let eok = {
                                            "articuloId" : it.articuloId,
                                            "valor"      : it.valor,                                    
                                            "ventaId"    : it.ventaId,
                                            "categoria"  : it.articulo.categoria.nombre,
                                            "marca"      : it.articulo.marca.nombre,
                                            "cantidad"   : it.cantidad,
                                            "nombre"     : it.articulo.nombre,
                                            "codigo"     : it.articulo.codigo
                                        }
                                        return eok;
                                    })
                                    res.status(200).send({message:"ventas lista", result: {item, items }});
                                }) 
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
    /** Buscar Venta **/
    static search(req, res) {  
        const { prop, value, usuarioId, rolId } = req.body              
        let oprop  = prop === "observaciones" ? value: '0'
        let iprop  = prop === "cliente" ? value: '0'     
        let dDesde = prop === "fechaVenta" ? (value ? new Date(value)  : '2020-01-01') : '2020-01-01'        
        let fprop  = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]    
        VentaService.search(oprop,iprop,fprop)
            .then((data)=>{
                let resData = data.data.map((item,index)=>{
                    let iok = {
                    "id"            : item.id,   
                    "fechaVenta"    : item.fechaVenta,
                    "tipo"          : item.tipo,
                    "total"         : item.total,
                    "observaciones" : item.observaciones,
                    "estado"        : item.estado,
                    "cliente"       : item.cliente.nombres
                    }
                return iok;
                })  
                res.status(200).send({message:"ventas lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
            })                  
            .catch((reason) => {                            
              res.status(400).send({ message: reason });
            });         
    }
    
   
     /** Borra Venta */
     static borrar(req, res) {     
        const { usuarioId, rolId } = req.body                                
        VentaItemsService.delete(req.params.id)
          .then((yitems)=>{                                                  
             VentaService.delete(req.params.id)
                .then((yitem)=>{
                    VentaService.getData(1,15)
                       .then((data)=>{
                            let resData = data.data.map((item,index)=>{
                                    let iok = {
                                    "id"             : item.id,   
                                    "fechaVenta"     : item.fechaVenta,
                                    "tipo"           : item.tipo,
                                    "total"          : item.total,
                                    "observaciones"  : item.observaciones,
                                    "estado"         : item.estado,
                                    "cliente"        : item.cliente.nombres
                                    }
                                return iok;
                                })  
                                res.status(200).send({message:"ventas lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
                        })
                })
            })                 
           .catch((reason) => {                          
              res.status(400).send({ message: reason });
           });         
    }

    /** Resumen Ventas */
    static resumen(req, res) {   
        //Mostrar Venta
        VentaService.getItemSingle(req.params.id)
            .then((xitem)=>{
                if(xitem.estado === "cerrado")
                {
                 Promise.all([VentaService.getItem(req.params.id),VentaItemsService.getItems(req.params.id),NotaCobranzaService.getKey("ventaId",req.params.id)])   
                   .then(([item,data,nota])=>{
                        let items = data.map((item,index)=>{
                            let iok = {
                            "id"           : item.id,   
                            "cantidad"     : item.cantidad,
                            "valor"        : item.valor,                 
                            "articuloId"   : item.articuloId,                                                                      
                            "nombre"       : item.articulo.nombre,                        
                            "codigo"       : item.articulo.codigo,                                 
                            "ventaId"      : item.ventaId,              
                            "nombreCorto"  : item.articulo.nombreCorto
                            }
                        return iok;
                        })                             
                        PlanService.getItems(nota.id)
                            .then((plan)=>{                        
                            res.status(200).send({message:"venta resumen", result: {item, items, nota, plan }});    
                        })
                   }) 
                }else{
                    Promise.all([VentaService.getItem(req.params.id),VentaItemsService.getItems(req.params.id)])   
                    .then(([item,data])=>{
                         let items = data.map((item,index)=>{
                             let iok = {
                             "id"           : item.id,   
                             "cantidad"     : item.cantidad,
                             "valor"        : item.valor,                 
                             "articuloId"   : item.articuloId,                                                                      
                             "nombre"       : item.articulo.nombre,                        
                             "codigo"       : item.articulo.codigo,     
                             "ventaId"      : item.ventaId,              
                             "nombreCorto"  : item.articulo.nombreCorto
                             }
                         return iok;
                         })                             
                         
                        res.status(200).send({message:"venta resumen", result: {item, items }});    
                         
                    }) 
                }
            })
            .catch((reason) => {
               console.log(reason)
               res.status(400).send({ message: reason });
            });
        
    }

    /** Aprobar Venta */    
    static aprobar(req, res) {          
        let d = new Date()
        let fechaVenta   = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]      
        var fechaGestion = d.getFullYear()
        var fechaMes     = d.getMonth() + 1
        const { item, items, contado, banco, inicial,cuota,total, usuarioId } = req.body               
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
                  "fechaVencimiento" :  fechaVenta,
                  "cuotas"           :  item.nroPagos,       
                  "ventaId"          :  req.params.id,                
                  "isVenta"          :  true,                
                  "mes"              :  fechaMes,  
                  "detalle"          :  "Nota de Venta Nro." + req.params.id 
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
                              isVenta   : true
                          }
                          return xdata;
                      })
                      //Crear Plan
                      PlanService.setAdd(xplan)
                          .then((yplan)=>{
                              //Registrar Movimiento
                              let newMovimiento = {
                                  origen   : "Venta",
                                  destino  : "Almacen Central",
                                  tipo     : "Salida",
                                  fecha    : fechaVenta,
                                  mes      : fechaMes,
                                  anio     : fechaGestion,
                                  ventaId  : req.params.id,                                
                                  almacenId: 1,
                                  usuarioId: usuarioId
                              }
                              MovimientoService.setAdd(newMovimiento)
                                  .then((xmovimiento)=>{
                                      //Registrar Items Almacen
                                      Promise.all([
                                          VentaService.getItemSingle(req.params.id),
                                          VentaItemsService.getList(req.params.id)])
                                          .then(([xyventa,xyitems])=>{
                                               //Flow Items   
                                                  xyitems.map(it=>{
                                                    AlmacenItemsService.verificar(it.articuloId,1)  
                                                      .then((xite)=>{
                                                        if(xite)
                                                        {
                                                            let dt = xite
                                                              dt.stock = xite.stock - it.cantidad                                                                  
                                                                AlmacenItemsService.setUpdate(dt, xite.id)
                                                                    .then((iok)=>{ console.log('actualizado')})                                                            
                                                        }
                                                      })  
                                                    return;  
                                                  })
                                              //Update Venta
                                               let newVenta = xyventa
                                                   newVenta.estado          = "cerrado"
                                                   newVenta.fechaAprobacion = fechaVenta
                                              //Registro Contabilidad, muestra DATA
                                              Promise.all([                                                
                                                  ComprobanteController.regComprobanteVenta(total,contado,banco,inicial,cuota,'Ingreso',xyventa.usuarioId,xyventa.clients,xyventa.observaciones),                                                  
                                                  VentaService.setUpdate(newVenta,req.params.id)
                                              ])     
                                                  .then(([xcomprobante,xconta])=>{
                                                      VentaService.getData(1,15)
                                                      .then((ydata)=>{
                                                          let resData = ydata.data.map((item,index)=>{
                                                              let iok = {
                                                              "id"             : item.id,   
                                                              "fechaVenta"     : item.fechaVenta,
                                                              "tipo"           : item.tipo,
                                                              "total"          : item.total,
                                                              "observaciones"  : item.observaciones,
                                                              "estado"         : item.estado,
                                                              "cliente"        : item.cliente.nombres
                                                              }
                                                          return iok;
                                                          })
                            
                                                          res.status(200).send({message:"ventas lista", result: {data: resData, total: ydata.total, pagina: ydata.pagina,paginas:ydata.paginas} });     
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
                              
                              //Registrar Movimiento
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

    // Get Data Clientes
    static getDataCliente(req, res) {               
        VentaService.dataCliente(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((data) => {                                                          
                    let resData = data.data.map((item,index)=>{
                        let iok = {
                            "id"               : item.id,   
                            "fechaVenta"       : item.fechaVenta,
                            "tipo"             : item.tipo,
                            "total"            : item.total,
                            "observaciones"    : item.observaciones,
                            "estado"           : item.estado,                                                       
                        }
                    return iok;
                    })  
              res.status(200).send({message:"ventas lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
            })                   
            .catch((reason) => {         
              res.status(400).send({ message: reason });
            });         
    }
    
}

export default SolicitudController;
