import CargoService from "../services/CargoService";

class CargoController {  

    static getDelete(req, res) {                           
        CargoService.delete(req.params.id)
            .then((cargo) => {                                    
                CargoService.getData(1,15,'id','DESC')
                  .then((cargos) => {                
                      res.status(200).send({message:"cargo eliminada", result: cargos });                                               
                })          
            })                   
            .catch((reason) => {              
          
              res.status(400).send({ message: reason });
            });         
      }

    static search(req, res) {  
        const { prop, value } = req.body                         
        CargoService.search(prop, value)
        .then((data)=>{
          let resData = data.data.map((item,index)=>{
              let iok = {
              "id"        : item.id,   
              "nombre"    : item.nombre,
              "salario"   : item.salario.nombre               
              }
          return iok;
          })  
          res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
        })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
      }
    
      static actualizar(req, res) {                           
        CargoService.setUpdate(req.body,req.params.id)
            .then((xcargo) => {                
                CargoService.getData(1,15,'id','asc')
                .then((data)=>{
                  let resData = data.data.map((item,index)=>{
                      let iok = {
                      "id"        : item.id,   
                      "nombre"    : item.nombre,
                      "salario"   : item.salario.nombre               
                      }
                  return iok;
                  })  
                  res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
                })            
            })                   
            .catch((reason) => {              
            
              res.status(400).send({ message: reason });
            });         
      }

    static getItem(req, res) {                           
        CargoService.getItem(req.params.id)
            .then((cargo) => {                
                res.status(200).send({message:"cargo item", result: cargo });                                               
            })                   
            .catch((reason) => {              
             
              res.status(400).send({ message: reason });
            });         
      }
      static getData(req, res) {                           
        CargoService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
          .then((data)=>{
            let resData = data.data.map((item,index)=>{
                let iok = {
                "id"        : item.id,   
                "nombre"    : item.nombre,
                "salario"   : item.salario.nombre               
                }
            return iok;
            })  
            res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
          })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
      }



    static getItems(req, res) {                   
        CargoService.getItems()
            .then((cargos) => {                
                res.status(200).send({message:"cargos lista", result: cargos });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 
    


    static crear(req, res) {           
        CargoService.setAdd(req.body)
            .then((cargo)=>{
              CargoService.getData(1,15,'id','asc')
              .then((data)=>{
                let resData = data.data.map((item,index)=>{
                    let iok = {
                    "id"        : item.id,   
                    "nombre"    : item.nombre,
                    "salario"   : item.salario.nombre               
                    }
                return iok;
                })  
                res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
              })                                  
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    } 




    static getList(req, res) {                                     
        CargoService.getList(req.params.name,req.params.value)
            .then((cargos) => {                
                res.status(200).send({message:"cargos lista", result: cargos });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }  
    
    
}

export default CargoController;
