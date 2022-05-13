import EmpresaService from "../services/EmpresaService";

class EmpresaController {

  static actualizar(req, res) {                           
    EmpresaService.setUpdate(req.body,req.params.id)
        .then((xcliente) => {                
          EmpresaService.getItem(req.params.id)
            .then((cliente)=>{
              res.status(200).send({message:"empresa actualizado", result: cliente });
            })            
        })                   
        .catch((reason) => {              
        
          res.status(400).send({ message: reason });
        });         
  }

  static getItem(req, res) {                           
    EmpresaService.getItem(req.params.id)
        .then((empresa) => {                
            res.status(200).send({message:"empresa item", result: empresa });                                               
        })                   
        .catch((reason) => {              
        
          res.status(400).send({ message: reason });
        });         
  }
  
    
}

export default EmpresaController;
