import CajaService from "../services/CajaService";
import CajaItemService from "../services/CajaItemService"
import VentaService from "../services/VentaService";
import VentaItemsService from "../services/VentaItemsService";
import AlmacenItemsService from "../services/AlmacenItemsService"
import NotaCobranzaService from "../services/NotaCobranzaService"
import PlanService from "../services/PlanService"
import ReciboService from "../services/ReciboService";
import ArticuloService from "../services/ArticuloService"
import MovimientoService from "../services/MovimientoService";

class TpvController {  

  static crear(req, res) {        
    const { item, items, almacenId } = req.body          
    let d = new Date()
    let fechaVenta   = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    let fechaAnio    = d.getFullYear()
    let fechaMes     = d.getMonth() + 1

    CajaService.getItemUsuario(item.usuarioId)     
        .then((xcaja)=>{
            if(xcaja){                    
                let fventa = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
                let zventa = item
                zventa.fechaVenta = fechaVenta                
                zventa.nroPagos   = 1
                zventa.tipo       = 'venta'
                zventa.estado     = 'cerrado' 
                zventa.origen     = 'venta directa tpdv'
                zventa.gestion    = fechaAnio
                zventa.mes        = fechaMes

                VentaService.setAdd(zventa)
                  .then((xitem) => {       
                    /**fin loop */                          
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
                            "mes"        : fechaMes,
                            "subTotal"   : it.subTotal,
                            "unidad"     : it.unidad
                        }
                        return iok;
                    })   
                    VentaItemsService.setAdd(newItems)
                      .then((yitem)=>{
                          /**4 Start Insert Nota */
                          let xnota = {
                            "tipo"             :  "contado",
                            "montoTotal"       :  item.totalGeneral,
                            "pagoTotal"        :  item.totalGeneral,
                            "saldoTotal"       :  0,
                            "fechaVencimiento" :  fechaVenta,
                            "cuotas"           :  item.nroPagos,       
                            "ventaId"          :  xitem,                
                            "isVenta"          :  true,                
                            "mes"              :  fechaMes,  
                            "detalle"          :  "Nota de Venta Nro." + xitem 
                            }
                          NotaCobranzaService.setNota(xnota)
                          .then((xs)=>{
                              /** 5 Start Plan */
                              let xplan={
                                cuota     : 1,
                                monto     : item.totalGeneral,
                                estado    : true,
                                fechaPago : fventa,
                                fechaPagado : fventa,
                                notaId    : xs,
                                mes       : d.getMonth()+1,
                                gestion   : fechaAnio,
                                isVenta   : true
                              }
                            
                              PlanService.setAddI(xplan)
                              .then((yplan)=>{                                
                                      items.map(xt=>{                                    
                                        AlmacenItemsService.verificar(xt.articuloId,almacenId)
                                        .then((xite)=>{                                                                             
                                          if(xite)
                                          {
                                            let dt = xite
                                                /*dt.stock = xite.stock - it.cantidad           */
                                                dt.stock = xite.stock > 0 ? parseInt(xite.stock) - parseInt(xt.cantidad) : xite.stock                                                       
                                                AlmacenItemsService.setUpdate(dt, xite.id)
                                                  .then((iok)=>{ console.log('actualizado')})                                                            
                                          }
                                        }) 
                                        return;     
                                      })
                                      /**maps ene items */
                                      /** 7 Start Cajas */
                                      let xcitem = {
                                            monto  : item.totalGeneral,
                                            tipo   : "ingreso",
                                            label  : "Pago tpv, venta nro. " + xitem.id,
                                            estado : true,
                                            cajaId : xcaja.id,
                                        }  
                                      CajaItemService.setAdd(xcitem)
                                        .then((xcajaitem)=>{
                                          let newCaja = xcaja                                                                                                                                                                                    
                                              newCaja.montoIngreso = parseFloat(xcaja.montoIngreso) + parseFloat(item.totalGeneral)
                                              newCaja.montoFinal   = parseFloat(xcaja.montoFinal) +  parseFloat(item.totalGeneral)
                                              newCaja.nro          = parseFloat(xcaja.nro) +  1
                                          /**8 Start Newcaja */
                                          Promise.all([CajaService.setUpdate(newCaja,xcaja.id),AlmacenItemsService.getData(1,22,'','',almacenId,0,3)])
                                          .then(([xycaja,data])=>{
                                            let resData = data.data.map((item,index)=>{
                                              let iok = {
                                              "id"           : item.id,                        
                                              "articuloId"   : item.articuloId,                        
                                              "stock"        : item.stock,                        
                                              "nombre"       : item.articulo.nombre,
                                              "categoriaId"  : item.articulo.categoriaId,
                                              "codigoBarras" : item.articulo.codigoBarras,
                                              "valor"        : item.articulo.precioVenta,
                                              "filename"     : item.articulo.filename, 
                                              "nombreCorto"  : item.articulo.nombreCorto,    
                                              }
                                              return iok;
                                            })
                                            res.status(200).send({message:"stock lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });

                                          })
                                          .catch((reason) => {   
                                            console.log(reason)                         
                                            res.status(400).send({ message: reason });
                                          });
                                          /**8 End Newcaja */
                                        })
                                        .catch((reason) => {   
                                          console.log(reason)                         
                                          res.status(400).send({ message: reason });
                                        });
                                      /** 7 End Cajas */
                             
                              })
                              .catch((reason) => {   
                                console.log(reason)                         
                                res.status(400).send({ message: reason });
                              });
                              /** 5 End Plan */
                          })
                          .catch((reason) => {   
                            console.log(reason)                         
                            res.status(400).send({ message: reason });
                          });
                          /**4 End Insert Nota */
                      })
                      .catch((reason) => {   
                        console.log(reason)                         
                        res.status(400).send({ message: reason });
                      });
                      /**3 en items */
                  })
                  .catch((reason) => {   
                    console.log(reason)                         
                    res.status(400).send({ message: reason });
                  });                           
            }else{
         
                res.status(400).send({message:"no tiene caja abierta", result: null });                                               
            }
        })                           
        .catch((reason) => {   
                 
          res.status(400).send({ message: reason });
        });         
}

    static searchs(req, res) {    
        const { nombre, almacenId } = req.body   
        console.log('*************')
        console.log(almacenId)
        console.log('*************')
        let args = isNaN(nombre.charAt(0));        
        let prop = args ? 'nombre' : 'codigo'                         
        
        AlmacenItemsService.searchSingle(prop,nombre,almacenId) 
           .then((data)=>{           
            let resData = data.map((item,index)=>{
              let iok = {
                  "id"               : item.articuloId,                       
                  "stock"            : item.stock,
                  "articuloId"       : item.articulo.id,
                  "precioVenta"      : item.articulo.precioVenta,
                  "nombre"           : item.articulo.nombre,
                  "codigo"           : item.articulo.codigo,
                  "filename"         : item.articulo.filename,
                  "nombreCorto"      : item.articulo.nombreCorto,
                  "descripcion"      : item.articulo.descripcion,
                  "unidad"           : item.articulo.unidad.nombre,
                  "costo"            : item.costo
              }
          return iok;
          })                  
          res.status(200).send({message:"articulos lista", result: resData });            
        })  
        .catch((reason) => {     
            console.log(reason)         
            res.status(400).send({ message: reason });
          });    
        
      }

    static search(req, res) {
        let args = isNaN(req.params.item.charAt(0));        
        let prop = args ? 'nombre' : 'codigo'              
        ArticuloService.searchSingle(prop,req.params.item)
            .then((data) => {               
              let resData = data.map((item,index)=>{
                let iok = {
                    "id"               : item.id,                                           
                    "articuloId"       : item.id,
                    "precioVenta"      : item.precioVenta,
                    "nombre"           : item.nombre,
                    "codigo"           : item.codigo,
                    "filename"         : item.filename,
                    "nombreCorto"      : item.nombreCorto,
                    "descripcion"      : item.descripcion,
                    "unidad"           : item.unidad.nombre,
                    "costo"            : item.costo
                }
            return iok;
            })                                            
            res.status(200).send({message:"articulos lista", result: resData });            
            })                   
            .catch((reason) => {     
              console.log(reason)         
              res.status(400).send({ message: reason });
            });      
    }


    static getData(req, res) {          
        if(req.params.orden === 4 || req.params.orden === '4'){
          VentaService.dataCajero(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
          .then((rows) =>{                              
            res.status(200).send({result: rows });                                  
            })
          .catch((reason) => {      
          
            res.status(400).send({ message: reason });
          }); 
        } else{
          VentaService.dataUsuario(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((rows) =>{                         
              res.status(200).send({result: rows });                                  
              })
            .catch((reason) => {      
              
              res.status(400).send({ message: reason });
            });
        }       
      }

      

    
}

export default TpvController;
