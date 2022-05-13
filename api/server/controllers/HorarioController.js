import HorarioService from "../services/HorarioService";

class HorarioController {  
    
  static getList(req, res) {                                     
    HorarioService.getList(req.params.name,req.params.value)
        .then((horarios) => {                
            res.status(200).send({message:"horarios lista", result: horarios });                                               
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
  }  


    static getDelete(req, res) {                           
        HorarioService.delete(req.params.id)
            .then((horario) => {                                    
                HorarioService.getData(1,15,'id','DESC')
                  .then((horarios) => {                
                      res.status(200).send({message:"horario eliminada", result: horarios });                                               
                })          
            })                   
            .catch((reason) => {              
          
              res.status(400).send({ message: reason });
            });         
      }

    static search(req, res) {  
        const { prop, value } = req.body                         
        HorarioService.search(prop, value)
            .then((data) => {                          
              res.status(200).send({message:"horarios lista", result: data });            
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
      }
    
      static actualizar(req, res) {   
        const { nombre, d1, d2, d3, d4  } = req.body                                
        HorarioService.setUpdate(req.body,req.params.id)
            .then((xhorario) => {                
                HorarioService.getData(1,15,'id','asc')
                .then((horarios) => {                
                    res.status(200).send({message:"horarios lista", result: horarios });                                               
                })            
            })                   
            .catch((reason) => {              
              console.log(reason)
              res.status(400).send({ message: reason });
            });         
      }

    static getItem(req, res) {                           
        HorarioService.getItem(req.params.id)
            .then((horario) => {                
                res.status(200).send({message:"horario item", result: horario });                                               
            })                   
            .catch((reason) => {              
             
              res.status(400).send({ message: reason });
            });         
      }
      static getData(req, res) {                           
        HorarioService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((horarios) => {                
                res.status(200).send({message:"horarios lista", result: horarios });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
      }



    static getItems(req, res) {                   
        HorarioService.getItems()
            .then((horarios) => {                
                res.status(200).send({message:"horarios lista", result: horarios });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 
    


    static crear(req, res) {           
        HorarioService.setAdd(req.body)
            .then((horario)=>{
              HorarioService.getData(1,15,'id','asc')
              .then((horarios) => {                
                  res.status(200).send({message:"horarios lista", result: horarios });                                               
              })                                  
            })                   
            .catch((reason) => {     
              console.log(reason)         
              res.status(400).send({ message: reason });
            });         
    } 




  
    
}

export default HorarioController;
