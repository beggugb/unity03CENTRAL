import TareaService from "../services/TareaService";

import moment from 'moment'

class TareaController {

  static getItem(req, res) {                           
    TareaService.getItem(req.params.id)
        .then((item) => {                
            res.status(200).send({message:"tarea item", result: item });
        })                   
        .catch((reason) => {                       
          res.status(400).send({ message: reason });
        });         
  }
  static add(req, res) {    
    const { usuarioId , inicio, fin } = req.body      
     TareaService.add(req.body)
      .then((tarea) => {        
         TareaService.getAll(usuarioId, inicio, fin)
            .then((data) => {
            res.status(200).send({ message:"tarea registrada", result: data });
         })  
      })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });    
      
  }

  static actualizar(req, res) {    
    const { usuarioId , inicio, fin } = req.body      
     TareaService.update(req.body,req.params.id)
      .then((tarea) => {        
         TareaService.getAll(usuarioId, inicio, fin)
            .then((data) => {
            res.status(200).send({ message:"tarea registrada", result: data });
         })  
      })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });    
      
  }


  static lista(req, res) {    
    const { usuarioId, start, end } = req.body;   

    TareaService.getAll(usuarioId, start, end)
      .then((data) => {
        res.status(200).send({ result: data });
      })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });    
  }
  

  static update(req, res) {        
    const { id, usuarioId , inicio, fin  } = req.body        
    Promise.all([ TareaService.update(req.body,id) ])
      .then(([tarea]) => {
        Promise.all([ TareaService.getAll(usuarioId, inicio, fin ) ])
            .then(([data]) => {
            res.status(200).send({ message:"tarea actualizada", result: data });
          })   
      })
      .catch((reason) => {
        
        res.status(400).send({ message: reason });
      });    
  }

}

export default TareaController;


   
