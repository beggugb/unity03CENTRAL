import PucService from "../services/PucService";


class PucController {

    static getList(req, res) {                   
        PucService.getItems(req.params.name,req.params.value)
            .then((plan) => {                
                res.status(200).send({message:"plan lista", result: plan });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }

    static getSearch(req, res) {    
        const { prop, value } = req.body             
        PucService.search(1,15,prop,value)
            .then((data) => {                              
                res.status(200).send({message:"pucs lista", result: data }); 
            })                   
            .catch((reason) => {     
                     
              res.status(400).send({ message: reason });
            }); 
      }

    static getItem(req, res) {                           
        PucService.getItem(req.params.id)
            .then((puc) => {                
                res.status(200).send({message:"puc item", result: puc });                                               
            })                   
            .catch((reason) => {              
             
              res.status(400).send({ message: reason });
            });         
      }

    static getData(req, res) {                           
        PucService.getData(req.params.pagina,req.params.num,req.params.prop)
            .then((pucs) => {                
                res.status(200).send({message:"pucs lista", result: pucs });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }
    static crear(req, res) {       
        const { codigo } = req.body
        let xnivel = codigo.length
        let xnew = req.body
        xnew.nivel = xnivel
        PucService.setAdd(xnew)        
            .then((xpucs) => {    
                PucService.getData(1,15,0)
                    .then((pucs) => { 
                    res.status(200).send({message:"pucs lista", result: pucs });                                               
                })
            })                       
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });                 
    }
    static actualizar(req, res) {   
                              
        PucService.setUpdate(req.body,req.params.id)
            .then((xpucs) => {    
                PucService.getData(1,15,0)
                    .then((pucs) => { 
                    res.status(200).send({message:"pucs lista", result: pucs });                                               
                })
            })                       
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }
    static getDelete(req, res) {               
        PucService.delete(req.params.id)        
            .then((xpucs) => {    
                PucService.getData(1,15,0)
                    .then((pucs) => { 
                    res.status(200).send({message:"pucs lista", result: pucs });                                               
                })
            })                       
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });                 
    }
     
}

export default PucController;
