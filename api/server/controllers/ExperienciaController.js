import ExperienciasService from "../services/ExperienciasService";

class ExperienciaController {  

    static getItem(req, res) {                           
        ExperienciasService.getItem(req.params.id)
            .then((experiencia) => {                
                res.status(200).send({message:"experiencia item", result: experiencia });                                               
            })                   
            .catch((reason) => {                           
              res.status(400).send({ message: reason });
            });         
    }

    static getData(req, res) {                           
      ExperienciasService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
          .then((experiencias) => {                
              res.status(200).send({message:"experiencias lista", result: experiencias });                                               
          })                   
          .catch((reason) => {              
            res.status(400).send({ message: reason });
          });         
    }

    static crear(req, res) {    
        const { personaId } = req.body       
        ExperienciasService.setAdd(req.body)
            .then((experiencia)=>{              
              ExperienciasService.getData(1,15,personaId)
              .then((experiencias) => {                
                  res.status(200).send({message:"experiencias lista", result: experiencias });                                               
              })                                  
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }

     
    static getDelete(req, res) {                           
        ExperienciasService.delete(req.params.id)
            .then((experiencia) => {                                    
                ExperienciasService.getData(1,15,req.params.tipo)
                  .then((experiencias) => {                
                      res.status(200).send({message:"experiencia eliminada", result: experiencias });                                               
                })          
            })                   
            .catch((reason) => {                        
              res.status(400).send({ message: reason });
            });         
    }
    static actualizar(req, res) {                           
        ExperienciasService.setUpdate(req.body,req.params.id)
            .then((xexperiencia) => {                
                ExperienciasService.getData(1,15,req.params.tipo)
                .then((experiencias) => {                
                    res.status(200).send({message:"experiencias lista", result: experiencias });                                               
                })            
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
    }
   
    
}

export default ExperienciaController;
