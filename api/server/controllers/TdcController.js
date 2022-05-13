import TdcService from "../services/TdcService";

class TdcController {  

  static search(req, res) {                            
    TdcService.getHoy()
        .then((data) => {                          
          res.status(200).send({message:"tdcs lista", result: data });            
        })                   
        .catch((reason) => {              
        
          res.status(400).send({ message: reason });
        });         
  }

  static lista(req, res) {    
    const { start, end } = req.body;       

    TdcService.getAll(start, end)
      .then((data) => {
        res.status(200).send({ result: data });
      })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });    
  }

  static getItem(req, res) {                           
    TdcService.getItem(req.params.id)
        .then((item) => {                
            res.status(200).send({message:"tarea item", result: item });
        })                   
        .catch((reason) => {                       
          res.status(400).send({ message: reason });
        });         
  }
  static add(req, res) {    
    const { inicio, fin } = req.body      
     TdcService.add(req.body)
      .then((tarea) => {        
         TdcService.getAll(inicio, fin)
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
    const { inicio, fin } = req.body      
     TdcService.update(req.body,req.params.id)
      .then((tarea) => {        
         TdcService.getAll(inicio, fin)
            .then((data) => {
            res.status(200).send({ message:"tarea registrada", result: data });
         })  
      })
      .catch((reason) => {
        console.log(reason)
        res.status(400).send({ message: reason });
      });    
      
  }


 
  

  static update(req, res) {        
    const { id, inicio, fin  } = req.body        
    Promise.all([ TdcService.update(req.body,id) ])
      .then(([tarea]) => {
        Promise.all([ TdcService.getAll(inicio, fin ) ])
            .then(([data]) => {
            res.status(200).send({ message:"tarea actualizada", result: data });
          })   
      })
      .catch((reason) => {
        
        res.status(400).send({ message: reason });
      });    
  }

  /*
  static getDelete(req, res) {                           
        TdcService.delete(req.params.id)
            .then((tdc) => {                                    
                TdcService.getData(1,15,'id','DESC')
                  .then((tdcs) => {                
                      res.status(200).send({message:"tdc eliminada", result: tdcs });                                               
                })          
            })                   
            .catch((reason) => {              
          
              res.status(400).send({ message: reason });
            });         
      }

    static search(req, res) {  
        const { prop, value } = req.body                         
        TdcService.search(prop, value)
            .then((data) => {                          
              res.status(200).send({message:"tdcs lista", result: data });            
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
      }
    
      static actualizar(req, res) {                           
        TdcService.setUpdate(req.body,req.params.id)
            .then((xtdc) => {                
                TdcService.getData(1,15,'id','desc')
                .then((tdcs) => {                
                    res.status(200).send({message:"tdcs lista", result: tdcs });                                               
                })            
            })                   
            .catch((reason) => {              
             
              res.status(400).send({ message: reason });
            });         
      }

    static getItem(req, res) {                           
        TdcService.getItem(req.params.id)
            .then((tdc) => {                
                res.status(200).send({message:"tdc item", result: tdc });                                               
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
      }
      static getData(req, res) {   

        TdcService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((tdcs) => {                
                res.status(200).send({message:"tdcs lista", result: tdcs });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
      }



    static getItems(req, res) {                   
        TdcService.getItems()
            .then((tdcs) => {                
                res.status(200).send({message:"tdcs lista", result: tdcs });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 
    


    static crear(req, res) {  
      const { monto } = req.body 
      var fechaHoy = new Date()    
      var fHoy = (new Date(fechaHoy + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]  
      var fGestion = fechaHoy.getFullYear()        
      TdcService.verificar()
        .then((xtdc)=>{
          if(xtdc){
             res.status(400).send({ message: "ya tiene registro para hoy " }); 
          }else{            
            let iok = req.body
            iok.fechaRegistro = fHoy
            iok.monto         = monto
            iok.gestion       = fGestion
            TdcService.setAdd(iok)
            .then((tdc)=>{
              TdcService.getData(1,15,'id','desc')
              .then((tdcs) => {                
                  res.status(200).send({message:"tdcs lista", result: tdcs });                                               
              })                                  
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
          }  
      })
      .catch((reason) => {              
        res.status(400).send({ message: reason });
      }); 
  }    
    

    static getList(req, res) {                                     
        TdcService.getItems(req.params.name,req.params.value)
            .then((tdcs) => {                
                res.status(200).send({message:"tdcs lista", result: tdcs });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }  */
    
    
}

export default TdcController;
