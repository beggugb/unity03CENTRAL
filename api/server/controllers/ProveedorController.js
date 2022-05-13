import ProveedorService from "../services/ProveedorService";

class ProveedorController {

  static search(req, res) {  
    const { prop, value } = req.body                         
    ProveedorService.search(prop, value)
        .then((data) => {                          
          res.status(200).send({message:"proveedor lista", result: data });            
        })                   
        .catch((reason) => {              
          console.log(reason)
          res.status(400).send({ message: reason });
        });         
  }

  static getDelete(req, res) {                           
    ProveedorService.delete(req.params.id)
        .then((proveedor) => {                                    
          ProveedorService.getData(1,15,'razonSocial','DESC')
              .then((data) => {                
                  res.status(200).send({message:"proveedor eliminado", result: data });                                               
            })          
        })                   
        .catch((reason) => {              
         
          res.status(400).send({ message: reason });
        });         
  }

  static setCopiar(req, res) {                           
    ProveedorService.getItem(req.params.id)
        .then((item) => {                
          let newItem = item
          newItem.id = null
          newItem.createdAt = null
          newItem.updatedAt = null
          newItem.codigo = '(copia)'+item.codigo
          newItem.razonSocial = '(copia)'+item.razonSocial,
          newItem.filename = 'default.jpg'
          ProveedorService.setAdd(newItem)
          .then((itm)=>{
            ProveedorService.getData(1,15,'id','desc')
              .then((data) => {                        
                  res.status(200).send({message:"proveedor copiado", result: data });                                               
              })
          })
        })                   
        .catch((reason) => {              
         
          res.status(400).send({ message: reason });
        });         
  }

  static crear(req, res) {           
    ProveedorService.setAdd(req.body)
        .then((row) => {                
          res.status(200).send({message:"proveedor registrado", result: row });                    
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
  }
  static actualizar(req, res) {                           
    ProveedorService.setUpdate(req.body,req.params.id)
        .then((xproveedor) => {                
          ProveedorService.getItem(req.params.id)
            .then((proveedor)=>{
              res.status(200).send({message:"proveedor actualizado", result: proveedor });
            })            
        })                   
        .catch((reason) => {              
         
          res.status(400).send({ message: reason });
        });         
  }

  static getItem(req, res) {                           
    ProveedorService.getItem(req.params.id)
        .then((proveedor) => {                
            res.status(200).send({message:"proveedor item", result: proveedor });                                               
        })                   
        .catch((reason) => {              
        
          res.status(400).send({ message: reason });
        });         
  }  

  static getData(req, res) {                           
    ProveedorService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
        .then((data) => {                
            res.status(200).send({message:"proveedores lista", result: data });                                               
        })                   
        .catch((reason) => {  
                   
          res.status(400).send({ message: reason });
        });         
  }

  
    
}
export default ProveedorController;
