import UsuarioService from "../services/UsuarioService";
import ClienteService from "../services/ClienteService";
import AlmacenService from "../services/AlmacenService"
import EmpresaService from "../services/EmpresaService"
import VentaService from "../services/VentaService"
import AlmacenItemsService from "../services/AlmacenItemsService"

const bcrypt = require('bcrypt')

class MobilController {

  static getSearchCliente(req, res) {  
    const { prop, value } = req.body                         
    ClienteService.search(prop, value)
        .then((data) => {                          
          res.status(200).send({message:"clientes lista", result: data });            
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

    static crearVenta(req, res) {   
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
        newItem.tipo        = 'venta'
        newItem.origen      = 'venta directa'



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
                        "mes"        : fechaMes,
                        "subTotal"   : it.subTotal
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
                                    "unidad"     : it.unidad,
                                    "cantidad"   : it.cantidad,
                                    "subTotal"   : it.subTotal,
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
    static actualizarVenta (req, res) {       
        const { item, items } = req.body 
        let d = new Date()
        let fechaVenta   = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
        let fechaAnio    = d.getFullYear()
        let fechaMes     = d.getMonth() + 1

        let newItems = items.map((it,index)=>{
            let iok = {
                "ventaId"    : item.id,
                "cantidad"   : it.cantidad,  
                "codigo"     : it.codigo,
                "valor"      : parseFloat(it.valor),                
                "articuloId" : it.articuloId,
                "gestion"    : fechaAnio,
                "mes"        : fechaMes,
                "subTotal"   : it.subTotal,
                "unidad"     : it.unidad
            }
            return iok;
        })                                    
          VentaItemsService.delete(item.id)
            .then((yitems) => {                                                         
                Promise.all([VentaItemsService.setAdd(newItems),VentaService.setUpdate(item,item.id)])
                   .then((ucompra,uitems)=>{
                        Promise.all([VentaService.getItemSingle(item.id),VentaItemsService.getItems(item.id)])
                                .then(([item, xitems]) =>{               
                                    let items = xitems.map((it,index)=>{
                                        let eok = {
                                            "articuloId" : it.articuloId,
                                            "valor"      : it.valor,       
                                            "subTotal"   : it.subTotal,                          
                                            "ventaId"    : it.ventaId,
                                            "unidad"     : it.unidad,
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

    static getDataProductos(req, res) {   
        const { pagina, num, name, codigo, almacenId, categoriaId, stock } = req.body                          
        AlmacenItemsService.getData(pagina,num, name, codigo, 1, categoriaId, stock)
            .then((data) => {  
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
                        "oferta"       : item.articulo.inOferta,
                        "precioOferta" : item.articulo.precioOferta,
                        }
                    return iok;
                })              
                res.status(200).send({message:"stock lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });                                               
            })                   
            .catch((reason) => {   
                console.log(reason)           
              res.status(400).send({ message: reason });
        });         
    }  

    static getDataVentas(req, res) {               
        VentaService.dataUsuario(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((data) => {                                                          
                    let resData = data.data.map((item,index)=>{
                        let iok = {
                        "id"             : item.id,   
                        "fechaVenta"     : item.fechaVenta,
                        "tipo"           : item.tipo,
                        "origen"         : item.origen,
                        "totalGeneral"   : item.totalGeneral,
                        "observaciones"  : item.observaciones,
                        "estado"         : item.estado,
                        "cliente"        : item.cliente.nombres,
                        "clienteId"      : item.cliente.id,
                        "usuarioId"      : item.usuarioId
                        }
                    return iok;
                    })  
              res.status(200).send({message:"ventas lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
            })                   
            .catch((reason) => {                      
              res.status(400).send({ message: reason });
            });         
    }

    static getItemCliente(req, res) {                           
        Promise.all([
          ClienteService.getItem(req.params.id),
          VentaService.dataCliente(1,15,req.params.id)]) 
            .then(([cliente,ventas]) => {                
                res.status(200).send({message:"cliente item", result: {cliente,ventas} });                                               
            })                   
            .catch((reason) => {                        
              res.status(400).send({ message: reason });
            });         
      }

    static getDataClientes(req, res) {                           
        ClienteService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((clientes) => {                
                res.status(200).send({message:"clientes lista", result: clientes });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }
    
    static login(req, res) {
        const { username, password } = req.body;    
        UsuarioService.login(username, password)
          .then((user) => {          
            if(user.usuario){       
              Promise.all([    
                AlmacenService.getItemSucursal(user.usuario.sucursalId),
                EmpresaService.getSingles(1)
              ])
                .then(([almacen, empresa]) =>{                                               
                  res.status(200).send({ user, almacen, empresa });
                })        
            }else{
              console.log(user)
              res.status(400).send({ message: user.message });
            }        
          })                   
          .catch((reason) => {             
            console.log(reason) 	    
            res.status(400).send({ message: reason });
        });
    }

/*
  static crear(req, res) {           
    UsuarioService.setAdd(req.body)
        .then((usuario)=>{          
          UsuarioService.getData(1,15,'nombres','asc')
          .then((usuarios)=>{
            res.status(200).send({message:"usuario actualizado", result: { usuarios } });
          })       
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
} 

  static actualizar(req, res) {                           
    if(req.params.tipo === 'dato')
    {
      UsuarioService.setUpdate(req.body,req.params.id)
      .then((xusuario) => {                
        UsuarioService.getItem(req.params.id)
          .then((usuario)=>{
            UsuarioService.getData(1,15,'nombres','asc')
              .then((usuarios)=>{
                res.status(200).send({message:"usuario actualizado", result: { usuarios } });
              })              
          })        
          .catch((reason) => {                        
            res.status(400).send({ message: reason });
          }) 
      })       
    }else{
      const { password }  = req.body
      let dtn = req.body
      dtn.password =  bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
      UsuarioService.setUpdate(dtn,req.params.id)
      .then((xusuario) => {                
        UsuarioService.getItem(req.params.id)
          .then((usuario)=>{
            UsuarioService.getData(1,15,'nombres','asc')
            .then((usuarios)=>{
              res.status(200).send({message:"usuario actualizado", result: { usuarios } });
            })               
          })        
          .catch((reason) => {                        
            res.status(400).send({ message: reason });
          }) 
      })
    }
  }

  static getData(req, res) {                           
    UsuarioService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
        .then((usuarios) => {                
            res.status(200).send({message:"usuarios lista", result: usuarios });                                               
        })                   
        .catch((reason) => {   
          console.log(reason)           
          res.status(400).send({ message: reason });
        });         
  }

  static getItem(req, res) {                           
    UsuarioService.getItem(req.params.id)
        .then((usuario) => {                
          ModuloService.getListSingle(usuario.rolId)
          .then((modulos)=>{
            res.status(200).send({message:"usuario item", result: { usuario, modulos } });
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



  static getItems(req, res) {                   
    UsuarioService.getItems()
        .then((usuarios) => {                
            res.status(200).send({message:"usuarios lista", result: usuarios });                                               
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
  }
*/
 
}


export default MobilController;
