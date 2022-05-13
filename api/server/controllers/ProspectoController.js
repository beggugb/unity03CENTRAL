import ProspectoService from "../services/ProspectoService";
import ProspectoClientesService from "../services/ProspectoClientesService";
import ArticuloService from "../services/ArticuloService";

class ProspectoController {

  static crear(req, res) {         
    let d            = new Date()
    let fprospecto   = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]  
    let fechaGestion = d.getFullYear()
    let litem = req.body
    litem.fecha       = fprospecto
    litem.vencimiento = fprospecto
    litem.articuloId  = null
    litem.gestion     = fechaGestion    

    ProspectoService.setAdd(litem)
        .then((prospecto)=>{            
            ProspectoService.getData(1,15,'id','DESC')
            .then((prospectos) => {                
                res.status(200).send({message:"prospecto creado", result: prospectos });                                               
            })
        })                                   
        .catch((reason) => { 
          console.log(reason)
          res.status(400).send({ message: reason });
        });         
  }

  static getItem(req, res) {        
    Promise.all([ProspectoService.getItem(req.params.id),ProspectoClientesService.getList(req.params.id)])
        .then(([item,items]) => {                
          ArticuloService.getItemSingle(item.articuloId)
            .then((articulo)=>{
              res.status(200).send({message:"prospecto item", result: {item,items,articulo} });
            })            
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static getDelete(req, res) {                           
    ProspectoService.delete(req.params.id)
        .then((prospecto) => {                                    
            ProspectoService.getData(1,15,'id','DESC')
              .then((prospectos) => {                
                  res.status(200).send({message:"prospecto eliminado", result: prospectos });                                               
            })          
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  } 

  static search(req, res) {  
    const { prop, value } = req.body                         
    ProspectoService.search(prop, value)
        .then((data) => {                          
          res.status(200).send({message:"prospectos lista", result: data });            
        })                   
        .catch((reason) => {                        
          res.status(400).send({ message: reason });
        });         
  }

  static actualizar(req, res) {                           
    ProspectoService.setUpdate(req.body,req.params.id)
        .then((xprospecto) => {                
          ProspectoService.getItem(req.params.id)
            .then((prospecto)=>{
              res.status(200).send({message:"prospecto actualizado", result: prospecto });
            })            
        })                   
        .catch((reason) => {
          console.log(reason)                        
          res.status(400).send({ message: reason });
        });         
  }

 
  static getData(req, res) {                           
    ProspectoService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
        .then((prospectos) => {                
            res.status(200).send({message:"prospectos lista", result: prospectos });                                               
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
  }
  
    
    
}

export default ProspectoController;
