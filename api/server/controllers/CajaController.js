import CajaService from "../services/CajaService";
import CajaItemService from "../services/CajaItemService"
import ComprobanteController from "./ComprobanteController";
import TdcService from "../services/TdcService"

class CajaController {  

    static getData(req, res) {                       
        CajaService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
        .then((items)=>{
            res.status(200).send({message:"lista cajas", result: items });     
        })        
        .catch((reason) => {              
            res.status(400).send({ message: reason });
        });  
    } 

    static verificar(req, res) {     
        const { usuarioId } = req.body 
        let d = new Date()
        let fcaja  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]               
        CajaService.getItemUsuario(usuarioId) 
        .then((item)=>{            
            res.status(200).send({message:"caja", result: { item }});     
        })        
        .catch((reason) => {              
            res.status(400).send({ message: reason });
        });  
    } 
    static resumen(req, res) {               
        Promise.all([CajaService.getItem(req.params.id),CajaItemService.getData(1,15,req.params.id)]) 
        .then(([item,items])=>{
            res.status(200).send({message:"lista cajas", result: { item, items }});     
        })        
        .catch((reason) => {              
            res.status(400).send({ message: reason });
        });  
    } 
    static resumenLarge(req, res) {               
        Promise.all([CajaService.getItem(req.params.id),CajaItemService.getItems(req.params.id)]) 
        .then(([item,items])=>{
            res.status(200).send({message:"lista cajas", result: { item, items }});     
        })        
        .catch((reason) => {              
            res.status(400).send({ message: reason });
        });  
    } 

    static crear(req, res) {         
        const { usuarioId, monto } = req.body     
        let d      = new Date()
        let fcaja  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]                   
        CajaService.getItemUsuario(usuarioId)
        .then((xcaja)=>{
            if(xcaja)
            {
              res.status(400).send({message:"tiene caja abierta"});                                               
            }else{                
                let newCaja = {}                
                newCaja.estado       = false,
                newCaja.montoInicial = monto,
                newCaja.montoEgreso  = 0,
                newCaja.montoIngreso = monto,
                newCaja.montoFinal   = monto,                
                newCaja.fechaCaja    = fcaja,
                newCaja.usuarioId    = usuarioId,
                newCaja.nro          = 1
                CajaService.setAdd(newCaja)
                .then((xcaja) => {           
                    let newItem = {}
                    newItem.monto  = monto,
                    newItem.tipo   = "ingreso",
                    newItem.label  = "Monto inicial caja / fecha :" + fcaja
                    newItem.estado = true
                    newItem.cajaId = xcaja.id
                    Promise.all([CajaItemService.setAdd(newItem),CajaService.getData(1,12,usuarioId,usuarioId)])
                    .then(([ycaja,ydata])=>{
                        res.status(200).send({message:"caja registrada", result: ydata });
                    })
                })                   
                .catch((reason) => {              
                  res.status(400).send({ message: reason });
                });   
            }
        })               
    }  

    static actualizar(req, res) {       
        const { usuarioId } = req.body  
        TdcService.verificar()
        .then((xtdc)=>{
           if(xtdc){
            CajaService.getItem(req.params.id)
        .then((xcaja)=>{            
            let d      = new Date()
            let fcaja  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
            let ncaja = {}
            ncaja.fechaCierre = fcaja
            ncaja.estado      = true
            let label = 'Registro desde TPV'
            let obs = 'Ventas del ' + xcaja.fechaCaja + ', usuario caja, ' + xcaja.usuario.nombres 
            Promise.all([CajaService.setUpdate(ncaja,xcaja.id),
            ComprobanteController.regComprobanteVenta(xcaja.montoFinal,true,false,false,0,'Ingreso',xcaja.usuario.id,label,obs)])            
            .then(([ycaja,ycompro])=>{
                CajaService.getData(1,12,usuarioId,usuarioId)
                .then((data)=>{
                    res.status(200).send({message:"caja cerrada", result: data });
                })
                .catch((reason) => {         
                    console.log(reason)     
                    res.status(400).send({ message: reason });
                })
            })
        })        
        .catch((reason) => {         
            console.log(reason)     
            res.status(400).send({ message: reason });
        })
           }
           else{
            res.status(400).send({ message: "No tiene registrado el tipo de cambio para hoy" }); 
           }
        })


    }      
}

export default CajaController;
