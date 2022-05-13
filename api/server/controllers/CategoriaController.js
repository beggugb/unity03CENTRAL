import CategoriaService from "../services/CategoriaService";

class CategoriaController {  

    static getDelete(req, res) {                           
        CategoriaService.delete(req.params.id)
            .then((categoria) => {                                    
                CategoriaService.getData(1,15,'id','DESC')
                  .then((categorias) => {                
                      res.status(200).send({message:"categoria eliminada", result: categorias });                                               
                })          
            })                   
            .catch((reason) => {                            
              res.status(400).send({ message: reason });
            });         
      }

    static search(req, res) {  
        const { prop, value } = req.body                         
        CategoriaService.search(prop, value)
            .then((data) => {                          
              res.status(200).send({message:"categorias lista", result: data });            
            })                   
            .catch((reason) => {                            
              res.status(400).send({ message: reason });
            });         
      }
    
      static actualizar(req, res) {                           
        CategoriaService.setUpdate(req.body,req.params.id)
            .then((xcategoria) => {                
                CategoriaService.getData(1,15,'id','asc')
                .then((categorias) => {                
                    res.status(200).send({message:"categorias lista", result: categorias });                                               
                })            
            })                   
            .catch((reason) => {                            
              res.status(400).send({ message: reason });
            });         
      }

    static getItem(req, res) {                           
        CategoriaService.getItem(req.params.id)
            .then((categoria) => {                
                res.status(200).send({message:"categoria item", result: categoria });                                               
            })                   
            .catch((reason) => {                            
              res.status(400).send({ message: reason });
            });         
      }
      static getData(req, res) {                           
        CategoriaService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((categorias) => {                
                res.status(200).send({message:"categorias lista", result: categorias });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
      }



    static getItems(req, res) {                   
        CategoriaService.getItems()
            .then((categorias) => {                
                res.status(200).send({message:"categorias lista", result: categorias });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 
    
    static getList(req, res) {                   
        CategoriaService.getItems(req.params.name,req.params.value)
            .then((categorias) => {                
                res.status(200).send({message:"categorias lista", result: categorias });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }

    static crear(req, res) {           
        CategoriaService.setAdd(req.body)
            .then((categoria)=>{
              CategoriaService.getData(1,15,'id','desc')
              .then((categorias) => {                
                  res.status(200).send({message:"categorias lista", result: categorias });                                               
              })                                  
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 
    
}

export default CategoriaController;
