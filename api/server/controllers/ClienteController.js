import ClienteService from "../services/ClienteService";
import CuentaCorrienteService from "../services/CuentaCorrienteService"
import VentaService from "../services/VentaService"

class ClienteController {

  static getItem(req, res) {                               
      ClienteService.getItem(req.params.id)
        .then((cliente) => {                
            res.status(200).send({message:"cliente item", result: {cliente} });                                               
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static getLicencia(req, res) {  
    const { licencia } = req.body         
      let d     = new Date()
      let flicencia = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]                        
    ClienteService.licencia(licencia)
      .then((cliente) => {                     
        if(cliente.fechaVencimiento >= flicencia)
        {
          res.status(200).send({message:"licencia vigente", result: {cliente:cliente,estado:true}});
        }else{
          res.status(200).send({message:"licencia vencida", result: {cliente:cliente,estado:false} });
        }        
      })                   
      .catch((reason) => {    
        console.log(reason)                    
        res.status(400).send({ message: reason });
      });         
}

  static getDelete(req, res) {                           
    ClienteService.delete(req.params.id)
        .then((cliente) => {                                    
            ClienteService.getData(1,15,'nombres','DESC')
              .then((clientes) => {                
                  res.status(200).send({message:"cliente eliminado", result: clientes });                                               
            })          
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static setCopiar(req, res) {                           
    ClienteService.getItem(req.params.id)
        .then((cliente) => {                
          let newItem = cliente
          newItem.id = null
          newItem.createdAt = null
          newItem.updatedAt = null
          newItem.codigo = '(copia)'+cliente.codigo
          newItem.nombres = '(copia)'+cliente.nombres
          ClienteService.setAdd(newItem)
          .then((itm)=>{
              ClienteService.getData(1,15,'nombres','DESC')
              .then((clientes) => {                
                  res.status(200).send({message:"cliente copiado", result: clientes });                                               
              })
          })
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static search(req, res) {  
    const { prop, value } = req.body                         
    ClienteService.search(prop, value)
        .then((data) => {                          
          res.status(200).send({message:"clientes lista", result: data });            
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static actualizar(req, res) {                           
    ClienteService.setUpdate(req.body,req.params.id)
        .then((xcliente) => {                
          ClienteService.getItem(req.params.id)
            .then((cliente)=>{
              res.status(200).send({message:"cliente actualizado", result: cliente });
            })            
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  
  static getData(req, res) {                           
    ClienteService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
        .then((clientes) => {                
            res.status(200).send({message:"clientes lista", result: clientes });                                               
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
  }
  
  static crear(req, res) {           
        const { nit } = req.body        
          ClienteService.verificar(nit)
            .then((row) => {                
                if(row)
                {
                  res.status(200).send({message:"el cliente ya existe", result: row });                          
                }else{
                  ClienteService.setAdd(req.body)
                    .then((cliente)=>{
                        let newCuenta = {
                            clienteId: cliente.id,
                            autorizacion: "cliente nuevo",
                            montoMaximo: 0,
                            estado: true,
                            montoInicial: 0,
                            montoAsignado: 0,
                            montoPagado: 0,
                            montoDiferencia: 0,
                            montoTotal: 0 
                        }                
                        CuentaCorrienteService.setAdd(newCuenta)
                        .then(()=>{
                            res.status(200).send({message:"cliente registrado", result: cliente });                           
                        })                               
                        .catch((reason) => {              
                            res.status(400).send({ message: reason });
                        });
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
    
}

export default ClienteController;
