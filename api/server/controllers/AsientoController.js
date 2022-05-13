import AsientoService from "../services/AsientoService";
import ComprobanteService from "../services/ComprobanteService";


class AsientoController {

    static getData(req, res) {                           
        AsientoService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((asientos) => {                
                res.status(200).send({message:"asientos lista", result: asientos });                                               
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }
    static crear(req, res) {           
        const { comprobanteId, pucId, tdc, debe, haber } = req.body     
        var fComprobante = new Date()    
        var fHoy = (new Date(fComprobante + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]         
        let ioks = req.body
        ioks.fechaAsiento = fHoy           
        ComprobanteService.getItem(comprobanteId)
        .then((xcomprobante)=>{
         
            AsientoService.setAdd(ioks)
            .then((xasiento) => {    
                let ycomprobante = xcomprobante
                ycomprobante.montoTotal = parseFloat(ycomprobante.montoTotal)+ parseFloat(debe)
                ycomprobante.tDebe      = parseFloat(ycomprobante.tDebe) + parseFloat(debe)
                ycomprobante.tHaber     = parseFloat(ycomprobante.tHaber) + parseFloat(haber)   
            
                ComprobanteService.setUpdate(ycomprobante,comprobanteId)
                .then((yxcompro)=>{
                    Promise.all([ComprobanteService.getItem(comprobanteId),AsientoService.getData(comprobanteId)])
                    .then(([comprobante,asientos]) => { 
                        res.status(200).send({message:"asientos lista", result: comprobante, asientos });                                               
                    })
                    .catch((reason) => {    
                        console.log(reason)          
                        res.status(400).send({ message: reason });
                      });
                })  
                .catch((reason) => {   
                    console.log(reason)            
                    res.status(400).send({ message: reason });
                  });                          
            })                       
            .catch((reason) => {    
                console.log(reason)               
              res.status(400).send({ message: reason });
            });
        })                     
    }
    static actualizar(req, res) {   
                              
        AsientoService.setUpdate(req.body,req.params.id)
            .then((xasientos) => {    
                AsientoService.getData(1,15,'id','asc')
                    .then((asientos) => { 
                    res.status(200).send({message:"asientos lista", result: asientos });                                               
                })
            })                       
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
    }
     
}

export default AsientoController;
