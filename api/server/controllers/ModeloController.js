import ModeloService from "../services/ModeloService";

class ModeloController {  

    static getItems(req, res) {                           
        ModeloService.getItems(req.params.prop,req.params.orden)
            .then((modelos) => {                
                res.status(200).send({message:"Modelos lista", result: modelos });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }  
    
}

export default ModeloController;
