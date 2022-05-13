import CajaService from "../services/CajaService";
import CajaItemService from "../services/CajaItemService"

class CajaItemsController {  
    
    static crear(req, res) {         
      const { usuarioId, monto, cajaId, tipo, label } = req.body     
      CajaService.getItem(cajaId)
      .then((xcaja)=>{
        let xcitem = {}
        xcitem.tipo   = tipo
        xcitem.monto  = monto
        xcitem.label  = label
        xcitem.estado = true
        xcitem.cajaId = xcaja.id
          CajaItemService.setAdd(xcitem)
          .then((xx)=>{
            let newCaja = xcaja          
            if(tipo ==="ingreso")
            {
                  newCaja.montoIngreso = parseFloat(xcaja.montoIngreso) + parseFloat(monto)
                  newCaja.montoFinal   = parseFloat(xcaja.montoFinal) +  parseFloat(monto)
                  newCaja.nro          = parseFloat(xcaja.nro) +  1   
                  CajaService.setUpdate(newCaja,xcaja.id)
                .then((xy)=>{
                  Promise.all([CajaService.getItem(xcaja.id),CajaItemService.getData(1,12,xcaja.id)])
                    .then(([item,items])=>{
                        res.status(200).send({message:"ingreso registrado", result: {item, items} }); 
                    })
              })
            }else{
              if(xcaja.montoEgreso === 0 || xcaja.montoFinal < monto)
                {
                   res.status(400).send({message:"no se puede registrar el egreso"});  
                }else{
                  newCaja.montoEgreso  = parseFloat(xcaja.montoEgreso) + parseFloat(monto)
                  newCaja.montoFinal   = parseFloat(xcaja.montoFinal) -  parseFloat(monto)
                  newCaja.nro          = parseFloat(xcaja.nro) +  1
                  CajaService.setUpdate(newCaja,xcaja.id)
                    .then((xy)=>{
                      Promise.all([CajaService.getItem(xcaja.id),CajaItemService.getData(1,12,xcaja.id)])
                        .then(([item,items])=>{
                            res.status(200).send({message:"egreso registrado", result: {item, items} }); 
                        })
                  })
                }                
            }                                                                                                
          })
      })  
    }  

    static getData(req, res) {           
      CajaItemService.getData(req.params.page,req.params.num,req.params.prop)
        .then((rows) => {                      
          res.status(200).send({result: rows });                        
        })                   
        .catch((reason) => {              	
          res.status(400).send({ message: reason });
        });
    }


    
}

export default CajaItemsController;
