import ArticuloService from "../services/ArticuloService";
import AlmacenItemsService from "../services/AlmacenItemsService"

class ArticuloController { 

  static getItem(req, res) {                           
    Promise.all([
      ArticuloService.getItem(req.params.id),
      AlmacenItemsService.getStockItems(req.params.id)
    ])  
     .then(([articulo,data]) => {     
      let existencias = data.map((item,index)=>{
        let iok = {
            "id"        : item.almacen.id,   
            "almacen"   : item.almacen.nombre,
            "direccion" : item.almacen.ubicacion,
            "stock"     : item.stock            
        }
    return iok;
    })          
         res.status(200).send({message:"articulo item", result: {articulo:articulo,existencias:existencias} });                                               
      })                   
        .catch((reason) => {              
          console.log(reason)
          res.status(400).send({ message: reason });
        });    
  }

  static getDelete(req, res) {                    
    ArticuloService.delete(req.params.id)
        .then((articulo) => {                                    
          ArticuloService.getData(1,15,'nombre','DESC')
          .then((data) => {                
            let resData = data.data.map((item,index)=>{
              let iok = {
                  "id"        : item.id,   
                  "codigo"    : item.codigoBarras,
                  "nombre"    : item.nombre,
                  "tipo"      : item.tipo,
                  "marca"     : item.marca.nombre,
                  "categoria" : item.categoria.nombre                
              }
          return iok;
          })
          res.status(200).send({message:"articulos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
          })         
        })                   
        .catch((reason) => {              
          console.log(reason)
          res.status(400).send({ message: reason });
        });         
  }
 

  static setCopiar(req, res) {                           
    ArticuloService.getItem(req.params.id)
        .then((articulo) => {                
          let newItem = articulo
          newItem.id = null
          newItem.createdAt    = null
          newItem.updatedAt    = null
          newItem.codigo       = '(copia..)'
          newItem.codigoBarras = '(copia..)'
          newItem.nombre      = '(copia)'+articulo.nombre
          ArticuloService.setAdd(newItem)
          .then((itm)=>{
                ArticuloService.getData(1,15,'nombre','DESC')
                .then((data) => {                
                  let resData = data.data.map((item,index)=>{
                    let iok = {
                        "id"        : item.id,   
                        "codigo"    : item.codigoBarras,
                        "nombre"    : item.nombre,
                        "tipo"      : item.tipo,
                        "marca"     : item.marca.nombre,
                        "categoria" : item.categoria.nombre                
                    }
                return iok;
                })
                res.status(200).send({message:"articulos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
                })
          })
        })                   
        .catch((reason) => {              
          console.log(reason)
          res.status(400).send({ message: reason });
        });         
  }

  static actualizar(req, res) {                      
    const {te ,cp, ter} = req.body
    let iok = req.body
    iok.sma = (te * cp) + (te * cp)
    iok.ms  = (ter - te) * cp   
    iok.smi = te * cp
    iok.pr  = (te * cp) + ((ter - te) * cp)
    ArticuloService.setUpdate(iok,req.params.id)
        .then((xarticulo) => {                
          ArticuloService.getItem(req.params.id)
            .then((articulo)=>{
              res.status(200).send({message:"articulo actualizado", result: articulo });
            })            
        })                   
        .catch((reason) => {              
          console.log(reason)
          res.status(400).send({ message: reason });
        });         
  }

  static getSearch(req, res) {    
    const { prop, value } = req.body      
 
    ArticuloService.search(prop,value)
        .then((data) => {                
          let resData = data.data.map((item,index)=>{
            let iok = {
                "id"        : item.id,   
                "codigo"    : item.codigoBarras,
                "nombre"    : item.nombre,
                "tipo"      : item.tipo,
                "marca"     : item.marca.nombre,
                "categoria" : item.categoria.nombre                
            }
        return iok;
        })
        res.status(200).send({message:"articulos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
        })                   
        .catch((reason) => {     
          console.log(reason)         
          res.status(400).send({ message: reason });
        }); 
  }

 

  static getData(req, res) {                           
    ArticuloService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
        .then((data) => {                
          let resData = data.data.map((item,index)=>{
            let iok = {
                "id"        : item.id,   
                "codigo"    : item.codigo,
                "nombre"    : item.nombre,
                "tipo"      : item.tipo,
                "marca"     : item.marca.nombre,
                "categoria" : item.categoria.nombre                
            }
        return iok;
        })
        res.status(200).send({message:"articulos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
  }

  static search(req, res) {    
    const { nombre, tipo, almacenId } = req.body       
  
    if(tipo === 'venta'){
       AlmacenItemsService.getData(1,15,nombre,0,almacenId,0,1) 
       .then((data)=>{ 
      
        let resData = data.data.map((item,index)=>{
          let iok = {
              "id"               : item.id,   
              "fechaVenta"       : item.cantidad,
              "stock"            : item.stock,
              "articuloId"       : item.articulo.id,
              "precioVenta"      : item.articulo.precioVenta,
              "nombre"           : item.articulo.nombre,
              "codigo"           : item.articulo.codigo,
              "marca"            : item.articulo.marca.nombre               
          }
      return iok;
      })        
      res.status(200).send({message:"articulos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} });            
       }) 

    }else{
       ArticuloService.getArticulosCompra(nombre)
       .then((data)=>{            
      
        res.status(200).send({message:"stock lista", result: data });
       })         
    } 
  }
  

  static lista(req, res) {        
    ArticuloService.getItemStock(req.params.name)
        .then((articulos) => {                
          res.status(200).send({message:"articulos lista", result: articulos });                                               
        })                   
        .catch((reason) => {  
          console.log(reason)            
          res.status(400).send({ message: reason });
        });         
  }
    

    static crear(req, res) {           
        const { codigo } = req.body
        ArticuloService.verificar(codigo)
            .then((row) => {                
                if(row)
                {
                  res.status(200).send({message:"el CÓDIGO  ya existe", result: null });                          
                }else{
                  ArticuloService.setAdd(req.body)
                    .then((articulo)=>{                        
                        res.status(200).send({message:"articulo registrado", result: articulo });                           
                    })                               
                    .catch((reason) => {              
                        res.status(400).send({ message: reason });                    
                    })                                          
                }                    
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });  
       
    }  
    
}

export default ArticuloController;
