import ProspectoService from "../services/ProspectoService";
import ProspectoClientesService from "../services/ProspectoClientesService";


class ProspectoClienteController {
  
  static crear(req, res) {        
     const { prospectoId } = req.body      

    ProspectoClientesService.setAdd(req.body)
        .then((prospecto)=>{            
          Promise.all([ProspectoService.getItem(prospectoId),ProspectoClientesService.getList(prospectoId)])  
            .then(([item,items]) => {                
                res.status(200).send({message:"prospecto creado", result: {item, items } });                                               
            })
        })                                   
        .catch((reason) => {              
            res.status(400).send({ message: reason });
        });         
    }  
    static getDelete(req, res) {                
       ProspectoClientesService.delete(req.params.id)
           .then((prospecto)=>{            
             Promise.all([ProspectoService.getItem(req.params.tipo),ProspectoClientesService.getList(req.params.tipo)])  
               .then(([item,items]) => {                
                   res.status(200).send({message:"prospecto creado", result: {item, items } });                                               
               })
           })                                   
           .catch((reason) => {              
               res.status(400).send({ message: reason });
           });         
       }   
    
}

export default ProspectoClienteController;
