import EstudiosService from "../services/EstudiosService";

class EstudioController {  

    static getItem(req, res) {                           
        EstudiosService.getItem(req.params.id)
            .then((estudio) => {                
                res.status(200).send({message:"estudio item", result: estudio });                                               
            })                   
            .catch((reason) => {                           
              res.status(400).send({ message: reason });
            });         
    }

    static getData(req, res) {                           
      EstudiosService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
          .then((estudios) => {                
              res.status(200).send({message:"estudios lista", result: estudios });                                               
          })                   
          .catch((reason) => {              
            res.status(400).send({ message: reason });
          });         
    }

    static crear(req, res) {    
        const { personaId } = req.body       
        EstudiosService.setAdd(req.body)
            .then((estudio)=>{              
              EstudiosService.getData(1,15,personaId)
              .then((estudios) => {                
                  res.status(200).send({message:"estudios lista", result: estudios });                                               
              })                                  
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }

     
    static getDelete(req, res) {                           
        EstudiosService.delete(req.params.id)
            .then((estudio) => {                                    
                EstudiosService.getData(1,15,req.params.tipo)
                  .then((estudios) => {                
                      res.status(200).send({message:"estudio eliminada", result: estudios });                                               
                })          
            })                   
            .catch((reason) => {                        
              res.status(400).send({ message: reason });
            });         
    }
    static actualizar(req, res) {                           
        EstudiosService.setUpdate(req.body,req.params.id)
            .then((xestudio) => {                
                EstudiosService.getData(1,15,req.params.tipo)
                .then((estudios) => {                
                    res.status(200).send({message:"estudios lista", result: estudios });                                               
                })            
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
    }
   
    
}

export default EstudioController;
