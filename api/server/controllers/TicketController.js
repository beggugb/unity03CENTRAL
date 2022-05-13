import TicketService from "../services/TicketService";
import TicketItemService from "../services/TicketItemService";

class TicketController {  

  static getItem(req, res) {                           
    Promise.all([TicketService.getItem(req.params.id),TicketItemService.getData(1,15,req.params.id)])
        .then(([ticket,items]) => {                
            res.status(200).send({message:"ticket item", result: {ticket,items} });                                               
        })                   
        .catch((reason) => {
          res.status(400).send({ message: reason });
        });         
  }

  static search(req, res) {  
    const { prop, value } = req.body                         
    TicketService.search(prop, value)
        .then((data) => {                          
          res.status(200).send({message:"tickets lista", result: data });            
        })                   
        .catch((reason) => {                      
          res.status(400).send({ message: reason });
        });         
  }

  static getData(req, res) {                           
      TicketService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
          .then((tickets) => {                
              res.status(200).send({message:"tickets lista", result: tickets });                                               
          })                   
          .catch((reason) => {     
            console.log(reason)         
            res.status(400).send({ message: reason });
          });         
    }

    static getDelete(req, res) {                           
        TicketService.delete(req.params.id)
            .then((ticket) => {                                    
                TicketService.getData(1,15,'id','DESC')
                  .then((tickets) => {                
                      res.status(200).send({message:"ticket eliminada", result: tickets });                                               
                })          
            })                   
            .catch((reason) => {              
          
              res.status(400).send({ message: reason });
            });         
      }

    
    
     

   
     



    static getItems(req, res) {                   
        TicketService.getItems(req.params.prop,req.params.orden)
            .then((tickets) => {                
                res.status(200).send({message:"tickets lista", result: tickets });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 
    


    static crear(req, res) {          
      let iok = req.body
      let d            = new Date()      
      let fechaGestion = d.getFullYear() 
      iok.gestion = fechaGestion
        TicketService.setAdd(iok)
            .then((ticket)=>{
              TicketService.getData(1,15,'id','asc')
              .then((tickets) => {                
                  res.status(200).send({message:"tickets lista", result: tickets });                                               
              })                                  
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 

    static actualizar(req, res) {                           
      TicketService.setUpdate(req.body,req.params.id)
          .then((xticket) => {                      
              TicketService.getItem(req.params.id)
              .then((tickets) => {                
                  res.status(200).send({message:"tickets lista", result: tickets });                                               
              })            
          })                   
          .catch((reason) => {              
          
            res.status(400).send({ message: reason });
          });         
    }




    static getList(req, res) {                                     
        TicketService.getItems(req.params.name,req.params.value)
            .then((tickets) => {                
                res.status(200).send({message:"tickets lista", result: tickets });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }  
    
    
}

export default TicketController;
