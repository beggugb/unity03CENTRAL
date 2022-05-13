import UnidadService from "../services/UnidadService";

class UnidadController {  

  static getList(req, res) {                                     
    UnidadService.getItems(req.params.name,req.params.value)
        .then((unidads) => {                
            res.status(200).send({message:"unidads lista", result: unidads });                                               
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
  } 

  static getDelete(req, res) {                           
        UnidadService.delete(req.params.id)
            .then((unidad) => {                                    
                UnidadService.getData(1,15,'id','DESC')
                  .then((unidads) => {                
                      res.status(200).send({message:"unidad eliminada", result: unidads });                                               
                })          
            })                   
            .catch((reason) => {              
          
              res.status(400).send({ message: reason });
            });         
  }

  static search(req, res) {  
        const { prop, value } = req.body                         
        UnidadService.search(prop, value)
            .then((data) => {                          
              res.status(200).send({message:"unidads lista", result: data });            
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
      }
    
      static actualizar(req, res) {                           
        UnidadService.setUpdate(req.body,req.params.id)
            .then((xunidad) => {                
                UnidadService.getData(1,15,'id','asc')
                .then((unidads) => {                
                    res.status(200).send({message:"unidads lista", result: unidads });                                               
                })            
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
      }

    static getItem(req, res) {                           
        UnidadService.getItem(req.params.id)
            .then((unidad) => {                
                res.status(200).send({message:"unidad item", result: unidad });                                               
            })                   
            .catch((reason) => {              
             
              res.status(400).send({ message: reason });
            });         
      }
      static getData(req, res) {                           
        UnidadService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((unidads) => {                
                res.status(200).send({message:"unidads lista", result: unidads });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
      }



    static getItems(req, res) {                   
        UnidadService.getItems()
            .then((unidads) => {                
                res.status(200).send({message:"unidads lista", result: unidads });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 
    


    static crear(req, res) {           
        UnidadService.setAdd(req.body)
            .then((unidad)=>{
              UnidadService.getData(1,15,'id','asc')
              .then((unidads) => {                
                  res.status(200).send({message:"unidads lista", result: unidads });                                               
              })                                  
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 

}

export default UnidadController;
