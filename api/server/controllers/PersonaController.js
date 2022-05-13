import PersonaService from "../services/PersonaService";
import EstudiosService from "../services/EstudiosService"
import ExperienciasService from "../services/ExperienciasService"
class PersonaController {

  static getItem(req, res) {    
    console.log(req.params.id)                       
    Promise.all([PersonaService.getItem(req.params.id),EstudiosService.getData(1,15,req.params.id),ExperienciasService.getData(1,15,req.params.id)])
        .then(([persona,estudios,experiencias]) => {                
            res.status(200).send({message:"persona item", result: {persona,estudios,experiencias} });
        })                   
        .catch((reason) => {          
          console.log(reason)              
          res.status(400).send({ message: reason });
        });         
  }

  static getData(req, res) {                           
        PersonaService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((personas) => {                
                res.status(200).send({message:"personas lista", result: personas });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
  }

    static getDelete(req, res) {                           
        PersonaService.delete(req.params.id)
            .then((persona) => {                                    
                PersonaService.getData(1,15,'nombres','DESC')
                .then((personas) => {                
                    res.status(200).send({message:"persona eliminado", result: personas });                                               
                })          
            })                   
            .catch((reason) => {  
                console.log(reason)                      
            res.status(400).send({ message: reason });
            });         
    }

  static setCopiar(req, res) {                           
    PersonaService.getItem(req.params.id)
        .then((persona) => {                
          let newItem = persona
          newItem.id = null
          newItem.createdAt = null
          newItem.updatedAt = null
          newItem.codigo = '(copia)'+persona.codigo
          newItem.nombres = '(copia)'+persona.nombres
          PersonaService.setAdd(newItem)
          .then((itm)=>{
              PersonaService.getData(1,15,'nombres','DESC')
              .then((personas) => {                
                  res.status(200).send({message:"persona copiado", result: personas });                                               
              })
          })
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static search(req, res) {  
    const { prop, value } = req.body                         
    PersonaService.search(prop, value)
        .then((data) => {                          
          res.status(200).send({message:"personas lista", result: data });            
        })                   
        .catch((reason) => {   
          console.log(reason)                     
          res.status(400).send({ message: reason });
        });         
  }

  static actualizar(req, res) {                           
    PersonaService.setUpdate(req.body,req.params.id)
        .then((xpersona) => {                
          PersonaService.getItem(req.params.id)
            .then((persona)=>{
              res.status(200).send({message:"persona actualizado", result: persona });
            })            
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  
  
  
  static crear(req, res) {           
     PersonaService.setAdd(req.body)
       .then((xpersona)=>{           
          PersonaService.getItem(xpersona)
            .then((xpersona)=>{
              res.status(200).send({message:"persona registrado", result: xpersona });                           
            })    
        })                               
        .catch((reason) => {        
           console.log(reason)       
          res.status(400).send({ message: reason });
        });        
    }  
    
}

export default PersonaController;
