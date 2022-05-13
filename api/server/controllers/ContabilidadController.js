import AsientoService from "../services/AsientoService";
import PucService from "../services/PucService";

var result1 = [];
var result2 = [];


function doAction(action) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`${action}: done.`)
    }, 3000)
  })
}

function doActions(action) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`${action}: done.`)
    }, 5000)
  })
}






class ContabilidadController {

  static saldos(req, res) {
    const { desde, hasta, pucId } = req.body;    

    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]    
    result1 = []
    result2 = []
    var releaseBrake = AsientoService.getListPuc(fdesde,fhasta).then(result => {
      let comprobantes = paremtrizar(result)
      result1 = comprobantes
      return doAction('Release brake')
    })
    var engageGear = releaseBrake.then(result => {   
      result1.map((ra,index)=>{         
        let sumaDebito  = 0
        let sumaCredito = 0
        AsientoService.getSaldos(fdesde,fhasta,ra.pucId)        
          .then((mayores)=>{                            
            mayores.map((item,index)=>{                                        
              sumaDebito  = sumaDebito + parseFloat(item.debe),
              sumaCredito = sumaCredito + parseFloat(item.haber)                      
            }) 
            let higo = {
              /*"sumaTotal"     : parseFloat(sumaTotal).toFixed(2),            */
              "codigo"       : ra.codigo,
              "descripcion"  : ra.detalle,
              "sumaDebito"   : sumaDebito.toFixed(2),
              "sumaCredito"  : sumaCredito.toFixed(2), 
              "deudor"       : sumaDebito > sumaCredito ? parseFloat(sumaDebito.toFixed(2)) - parseFloat(sumaCredito.toFixed(2)): 0,
              "acreedor"     : sumaDebito < sumaCredito ? parseFloat(sumaCredito.toFixed(2)) - parseFloat(sumaDebito.toFixed(2)): 0
            }
            /*console.log(higo)*/
            result2.push(higo)
          })         
      })      
      return doActions('Engaging gear')
    })

    engageGear.then(result => {
       
      let iok  = result1.length
      let tt   = totales(result2)
      res.status(200).send({ result: tt, iok, result2  });

    })
   
  } 

 

  static diarios(req, res) {
    const { desde, hasta, pucId } = req.body;    
    var d = new Date()
    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]    
         
    AsientoService.getDiarios(fdesde,fhasta,d.getFullYear())
    .then((xmayores)=>{        
        let sumaDebito  = 0
        let sumaCredito = 0        
        let detalle = xmayores.map((item,index)=>{                    
          let iok = {
          "id"            : item.id, 
          "comprobanteId" : item.comprobanteId,        
          "detalle"       : item.puc.descripcion,
          "codigo"        : item.puc.codigo,
          "debe"          : item.debe,
          "haber"         : item.haber,            
          }          
          sumaDebito  = sumaDebito + parseFloat(item.debe)
          sumaCredito = sumaCredito + parseFloat(item.haber)
        return iok;
        }) 
      
        res.status(200).send({ result: detalle, sumaDebito, sumaCredito });     
    })
    .catch((reason) => {         
        console.log(reason)
        res.status(400).send({ message: reason });
    });
          
  }


  static mayores(req, res) {
    const { desde, hasta, pucId } = req.body;    

    var dDesde = new Date(desde)
    var dHasta = new Date(hasta)    
    var fdesde = (new Date(dDesde + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
    var fhasta = (new Date(dHasta + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]    
    
    Promise.all([PucService.getItem(pucId),AsientoService.getMayores(fdesde,fhasta,pucId)])
    .then(([xpuc,xmayores])=>{
        let sumaTotal = 0      
        let sumaDebito  = 0
        let sumaCredito = 0
        let debitoCierre = 0
        let creditoCierre = 0
        let detalle = xmayores.map((item,index)=>{          
          /*sumaTotal  = item.debe === item.haber ? sumaTotal: (item.debe === '0' ? sumaTotal - parseFloat(item.haber) : sumaTotal + parseFloat(item.debe)  ) */
          sumaTotal = calcularSaldo(sumaTotal,item.debe,item.haber,xpuc.tipo)
          let iok = {
          "id"            : item.id, 
          "comprobanteId" : item.comprobanteId,        
          "fechaAsiento"  : item.fechaAsiento, 
          "detalle"       : item.comprobante.glosaComprobante,
          "debito"        : item.debe,
          "credito"       : item.haber,          
          "saldo"         : sumaTotal
          }
          sumaDebito  = sumaDebito + parseFloat(item.debe)
          sumaCredito = sumaCredito + parseFloat(item.haber)
        return iok;
        })
        creditoCierre = sumaDebito > sumaCredito ? parseFloat(sumaDebito.toFixed(2)) - parseFloat(sumaCredito.toFixed(2)): 0
        debitoCierre = sumaDebito < sumaCredito ? parseFloat(sumaCredito.toFixed(2)) - parseFloat(sumaDebito.toFixed(2)): 0
        res.status(200).send({ result: xpuc, detalle, sumaDebito, sumaCredito, debitoCierre, creditoCierre });     
    })
    .catch((reason) => {         
        console.log(reason)
        res.status(400).send({ message: reason });
    });
          
  }
  

}

function calcularSaldo(monto, debe,haber,tipo){
  
  let valor = 0
  let res = 0
  if(tipo === "Pasivo" || tipo === "Ingresos")
  {
    /*Start-Pasivo */
    if(monto === 0){
          if(debe > haber)
          {
            valor = parseFloat(debe)
          }else{
            valor = parseFloat(haber)
          }
    }else{
          if(debe > haber)
          { 
            valor = parseFloat(monto) - (parseFloat(debe)-parseFloat(haber))
          }else{
            valor = parseFloat(monto) + (parseFloat(haber)-parseFloat(debe))
          }
    }
    /*End-Pasivo */
  }
  else{
    /*Start-Activo */
    if(monto === 0){
      if(debe > haber)
      {
        valor = parseFloat(debe)
      }else{
        valor = parseFloat(haber)
      }
    }else{
      if(debe > haber)
      { 
        valor = parseFloat(monto) + (parseFloat(debe)-parseFloat(haber))
      }else{
        valor = parseFloat(monto) - (parseFloat(haber)-parseFloat(debe))
      }
    } 
    /*End-Activo */
  }
  
  res = valor.toFixed(2)
  return res
}
function paremtrizar(data){  
  let arr = []
  data.map((item,index)=>{                  
    let iok = {
    "pucId"           : item.pucId,     
    "codigo"   : item.puc.codigo,        
    "detalle"  : item.puc.descripcion
    }
    arr.push(iok)
  })
  
 return arr
}


function totales(data){  
  let arr = []
  let totalDebitos  = 0
  let totalCreditos = 0
  let totalDeudor   = 0
  let totalAcreedor = 0
  data.map((item,index)=>{                      
    totalDebitos  = parseFloat(totalDebitos) + parseFloat(item.sumaDebito)
    totalCreditos = parseFloat(totalCreditos) + parseFloat(item.sumaCredito)    
    totalDeudor   = parseFloat(totalDeudor) + parseFloat(item.deudor)    
    totalAcreedor = parseFloat(totalAcreedor) + parseFloat(item.acreedor)    
  })
  
  let higo = {
    "totalDebitos"  : totalDebitos,
    "totalCreditos" : totalCreditos,
    "totalDeudor"   : totalDeudor,
    "totalAcreedor" : totalAcreedor
  }  
 return higo
}


export default ContabilidadController;



