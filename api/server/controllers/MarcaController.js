import MarcaService from "../services/MarcaService";

class MarcaController {  

  static getList(req, res) {                                     
    MarcaService.getItems(req.params.name,req.params.value)
        .then((marcas) => {                
            res.status(200).send({message:"marcas lista", result: marcas });                                               
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
  } 

  static getDelete(req, res) {                           
        MarcaService.delete(req.params.id)
            .then((marca) => {                                    
                MarcaService.getData(1,15,'id','DESC')
                  .then((marcas) => {                
                      res.status(200).send({message:"marca eliminada", result: marcas });                                               
                })          
            })                   
            .catch((reason) => {              
          
              res.status(400).send({ message: reason });
            });         
  }

  static search(req, res) {  
        const { prop, value } = req.body                         
        MarcaService.search(prop, value)
            .then((data) => {                          
              res.status(200).send({message:"marcas lista", result: data });            
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
      }
    
      static actualizar(req, res) {                           
        MarcaService.setUpdate(req.body,req.params.id)
            .then((xmarca) => {                
                MarcaService.getData(1,15,'id','asc')
                .then((marcas) => {                
                    res.status(200).send({message:"marcas lista", result: marcas });                                               
                })            
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
      }

    static getItem(req, res) {                           
        MarcaService.getItem(req.params.id)
            .then((marca) => {                
                res.status(200).send({message:"marca item", result: marca });                                               
            })                   
            .catch((reason) => {              
             
              res.status(400).send({ message: reason });
            });         
      }
      static getData(req, res) {                           
        MarcaService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((marcas) => {                
                res.status(200).send({message:"marcas lista", result: marcas });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
      }



    static getItems(req, res) {                   
        MarcaService.getItems()
            .then((marcas) => {                
                res.status(200).send({message:"marcas lista", result: marcas });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 
    


    static crear(req, res) {           
        MarcaService.setAdd(req.body)
            .then((marca)=>{
              MarcaService.getData(1,15,'id','asc')
              .then((marcas) => {                
                  res.status(200).send({message:"marcas lista", result: marcas });                                               
              })                                  
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 

}

export default MarcaController;
