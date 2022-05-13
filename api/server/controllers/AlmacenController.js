import AlmacenItemsService from "../services/AlmacenItemsService";
import AlmacenService from "../services/AlmacenService";

class AlmacenController {  

    static getData(req, res) {                           
        AlmacenService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((almacens) => {                
                res.status(200).send({message:"almacens lista", result: almacens });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
        });         
    }
    
    static getItem(req, res) {                           
        AlmacenService.getItem(req.params.id)
            .then((almacen) => {                
                res.status(200).send({message:"almacen item", result: almacen });                                               
            })                   
            .catch((reason) => {              
             
              res.status(400).send({ message: reason });
        });         
    }   
    
    static getDelete(req, res) {                           
        AlmacenService.delete(req.params.id)
            .then((almacen) => {                                    
                AlmacenService.getData(1,15,'id','DESC')
                    .then((almacens) => {                
                          res.status(200).send({message:"almacen eliminada", result: almacens });                                               
                    })          
                })                   
            .catch((reason) => {                        
                  res.status(400).send({ message: reason });
        });         
      }
    static actualizar(req, res) {                           
        AlmacenService.setUpdate(req.body,req.params.id)
            .then((xalmacen) => {                
                AlmacenService.getData(1,15,'id','asc')
                .then((almacens) => {                
                    res.status(200).send({message:"almacens lista", result: almacens });                                               
                })            
            })                   
            .catch((reason) => {                          
              res.status(400).send({ message: reason });
        });         
    }
    static crear(req, res) {           
        AlmacenService.setAdd(req.body)
            .then((almacen)=>{
                AlmacenService.getData(1,15,'id','asc')
                  .then((almacens) => {                
                      res.status(200).send({message:"almacens lista", result: almacens });                                               
                  })                                  
                })                   
            .catch((reason) => {              
                res.status(400).send({ message: reason });
        });         
    } 
    

    static getList(req, res) {                   
        AlmacenService.getItems(req.params.name,req.params.value)
            .then((almacenes) => {                
                res.status(200).send({message:"almacenes lista", result: almacenes });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }

    static listaStock(req, res) {   
        const { pagina, num, name, codigo, almacenId, categoriaId, stock } = req.body                          
        AlmacenItemsService.getData(pagina,num,name, codigo, almacenId, categoriaId, stock)
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
    
}

export default AlmacenController;
