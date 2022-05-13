import ContratoService from "../services/ContratoService";

class ContratoController {

  static crear(req, res) {           
    let d = new Date()
    let fcompra  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]           
      let xiok = {
        nro: '',
        fechaInicio: fcompra,
        fechaFin: fcompra,
        plazo: 'fijo',
        contratado: false,
        observaciones: 's/n',
        personaId: null,
        horarioId: null,
        salarioId: null,
        cargoId: null       
      }
      ContratoService.setAdd(xiok)
        .then((xcnt)=>{
          ContratoService.getData(1,15,'id','desc')
            .then((data)=>{
              let resData = data.data.map((item,index)=>{
                  let iok = {
                  "id"            : item.id,   
                  "plazo"         : item.plazo,
                  "fechaInicio"   : item.fechaInicio,
                  "fechaFin"      : item.fechaFin,
                  "estado"        : item.contratado,
                  "ci"            : item.persona.id !== null ? item.persona.ci : 's/n',
                  "persona"       : item.persona.id !== null ? item.persona.nombres : 's/n',
                  "cargo"         : item.cargo.id !== null ? item.cargo.nombre : 's/n',
                  }
              return iok;
              })  
              res.status(200).send({message:"contratos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
            })
        })
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });
  }

  static getDelete(req, res) {                           
    ContratoService.delete(req.params.id)
        .then((contrato) => {                                    
            ContratoService.getData(1,15,'nombres','DESC')
              .then((contratos) => {                
                  res.status(200).send({message:"contrato eliminado", result: contratos });                                               
            })          
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static setCopiar(req, res) {                           
    ContratoService.getItem(req.params.id)
        .then((contrato) => {                
          let newItem = contrato
          newItem.id = null
          newItem.createdAt = null
          newItem.updatedAt = null
          newItem.codigo = '(copia)'+contrato.codigo
          newItem.nombres = '(copia)'+contrato.nombres
          ContratoService.setAdd(newItem)
          .then((itm)=>{
              ContratoService.getData(1,15,'nombres','DESC')
              .then((contratos) => {                
                  res.status(200).send({message:"contrato copiado", result: contratos });                                               
              })
          })
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static search(req, res) {  
    const { prop, value } = req.body   
                      
    ContratoService.search(prop, value)
    .then((data)=>{
      let resData = data.data.map((item,index)=>{
          let iok = {
          "id"            : item.id,   
          "plazo"         : item.plazo,
          "fechaInicio"   : item.fechaInicio,
          "fechaFin"      : item.fechaFin,
          "estado"        : item.contratado,
          "ci"            : item.persona.id !== null ? item.persona.ci : 's/n',
          "persona"       : item.persona.id !== null ? item.persona.nombres : 's/n',
          "cargo"         : item.cargo.id !== null ? item.cargo.nombre : 's/n',
          }
      return iok;
      })  
      res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
    })                  
        .catch((reason) => {  
          console.log(reason)                      
          res.status(400).send({ message: reason });
        });         
  }

  static actualizar(req, res) {                           
    ContratoService.setUpdate(req.body,req.params.id)
        .then((xcontrato) => {                
          ContratoService.getItem(req.params.id)
            .then((contrato)=>{
              res.status(200).send({message:"contrato actualizado", result: contrato });
            })            
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static getItem(req, res) {                           
    ContratoService.getItem(req.params.id)
        .then((contrato) => {       
  
            res.status(200).send({message:"contrato item", result: contrato });
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }
  static getData(req, res) {                           
    ContratoService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
        .then((data)=>{
          let resData = data.data.map((item,index)=>{           
              let iok = {
              "id"            : item.id,   
              "plazo"         : item.plazo,
              "fechaInicio"   : item.fechaInicio,
              "fechaFin"      : item.fechaFin,
              "estado"        : item.contratado,
              "ci"            : item.persona.id !== null ? item.persona.ci : 's/n',
              "persona"       : item.persona.id !== null ? item.persona.nombres : 's/n',
              "cargo"         : item.cargo.id !== null ? item.cargo.nombre : 's/n',
              }
          return iok;
          })  
          res.status(200).send({message:"compras lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
        })                   
        .catch((reason) => {                     
          res.status(400).send({ message: reason });
        });         
  }
  
    
    
}

export default ContratoController;
