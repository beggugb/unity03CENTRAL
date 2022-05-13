import CompraService from "../services/CompraService";
import CompraItemsService from "../services/CompraItemsService";
import CotizacionpService from "../services/CotizacionprService"
import CotizacionService from "../services/CotizacionService";
import CotizacionItemsService from "../services/CotizacionItemsService";
import ClienteService from "../services/ClienteService";
import UsuarioService from "../services/UsuarioService";
import EmpresaService from "../services/EmpresaService";
import MailService from "../services/MailService";
import ProspectoService from "../services/ProspectoService"
import ProspectoClientesService from "../services/ProspectoClientesService"
import ArticuloService from "../services/ArticuloService"
import pdfVenta from '../../public/documents/venta'
import pdfCotizacion from '../../public/documents/cotizacion'
import pdfCotizaciones from '../../public/documents/cotizaciones'
import pdfCompra from '../../public/documents/compra'
import pdfPromocion from '../../public/documents/promocion'
const path = require('path');
const pdf = require('html-pdf');
const hostname = '192.168.0.100'
const port = 4000

var options = { 
  "format": "Letter", 
  "orientation":"portrait"    
 };


const createPdfs = (compra,items,nombres,email,observaciones) => {    
  let d      = new Date() 
  let fecha  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
  let hora   = d.getHours() +':'+ d.getMinutes()

  let img1 = `http://${hostname}:${port}/api/static/images/empresa/sm/logo.png`;  
  let img2 = `http://${hostname}:${port}/api/static/images/articulos/sm/`;
   pdf.create(pdfCompra(img1,img2,compra,items,nombres,email,observaciones,fecha,hora), options).toFile(`${process.cwd()}/api/public/documents/cotizacionCompra${compra.id}.pdf`, (err) => {
     if(err) { res.send(Promise.reject());}
         return 0	 
  })      
}

const promocionPdf = (promocion,empresa) => {    
  let d      = new Date() 
  let fecha  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
  let hora   = d.getHours() +':'+ d.getMinutes()

  let img1 = `http://${hostname}:${port}/api/static/images/empresa/sm/logo.png`;  
  let img2 = `http://${hostname}:${port}/api/static/images/articulos/lg/`;
   pdf.create(pdfPromocion(img1,img2,promocion,empresa,fecha,hora), options).toFile(`${process.cwd()}/api/public/documents/promocion${promocion.id}.pdf`, (err) => {
     if(err) { res.send(Promise.reject());}
         return 0	 
  })      
}
/*xcotizacion,xempresa,xcliente,xitems,nombres,email,observaciones*/
const cotizacionPdf = (cotizacion,empresa,cliente,items,nombres,email,observaciones) => {    
  let d      = new Date() 
  let fecha  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
  let hora   = d.getHours() +':'+ d.getMinutes()

  let img1 = `http://${hostname}:${port}/api/static/images/empresa/sm/logo.png`;  
  let img2 = `http://${hostname}:${port}/api/static/images/articulos/sm/`;
   pdf.create(pdfCotizacion(img1,img2,cotizacion,empresa,cliente,items,nombres,email,observaciones,fecha,hora), options).toFile(`${process.cwd()}/api/public/documents/cotizacion${cotizacion.id}.pdf`, (err) => {
     if(err) { res.send(Promise.reject());}
         return 0	 
  })      
}

const cotizacionesPdf = (item,items,empresa,observaciones) => {    
  let d      = new Date() 
  let fecha  = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
  let hora   = d.getHours() +':'+ d.getMinutes()

  let img1 = `http://${hostname}:${port}/api/static/images/empresa/sm/logo.png`;  
  let img2 = `http://${hostname}:${port}/api/static/images/articulos/sm/`;
   pdf.create(pdfCotizaciones(img1,img2,item,items,empresa,observaciones,fecha,hora), options).toFile(`${process.cwd()}/api/public/documents/cotizaciones${item.id}.pdf`, (err) => {
     if(err) { res.send(Promise.reject());}
         return 0	 
  })      
}
class MailController {  

  static enviarCotizacion(req, res) {           
    const { nombres, email, cotizacionId, observaciones } = req.body
      Promise.all([CotizacionService.getItem(cotizacionId),CotizacionItemsService.getItems(cotizacionId)])
        .then(([xcotizacion,xitems])=>{      
          Promise.all([EmpresaService.getSingle(1),ClienteService.getItemSingle(xcotizacion.clienteId)])
            .then(([xempresa,xcliente])=>{              
              Promise.all([cotizacionPdf(xcotizacion,xempresa,xcliente,xitems,nombres,email,observaciones)])           
                .then(([pdf]) => {
                  MailService.sendCotizacion(cotizacionId,xempresa,nombres,email)
                  .then((mail)=>{
                    res.status(200).send({message:"cotizacion enviada", result: mail });    
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
  static enviarCotizaciones(req, res) {          
    const { compraId, observaciones, subject } = req.body 
    Promise.all([CompraService.getItem(compraId),CompraItemsService.getItems(compraId),CotizacionpService.getItems(compraId),EmpresaService.getSingle(1)])
        .then(([xitem,xitems,xproveedores,xempresa]) => {                                                      
          Promise.all([cotizacionesPdf(xitem,xitems,xempresa,observaciones)])  
          .then(([pdf]) => {
            xproveedores.map((itt)=>{
            
              MailService.getCotizaciones(compraId,subject,xempresa,itt)
              .then((mail)=>{
                console.log('pppp')    
              })
              return;              
            }) 
            res.status(200).send({message:"cotizaciones enviada" });
          })                                               
        }) 
  } 
  static enviarProspecto(req, res) {          
    const { prospectoId, subject } = req.body 
    Promise.all([ProspectoService.getItemArticulo(prospectoId),ProspectoClientesService.getListSingle(prospectoId),EmpresaService.getSingle(1)])
        .then(([prospecto,items,xempresa]) => {                                                      
          Promise.all([promocionPdf(prospecto,xempresa)])           
          .then(([pdf]) => {              
            items.map((itt)=>{
              MailService.getProspecto(prospectoId,subject,xempresa,itt.cliente)
              .then((mail)=>{
                console.log('ppp')    
              })
              return;              
            })            
            res.status(200).send({message:"promoción enviada" });          
          })        
        }) 
  }
  static solicitarCotizacion(req, res) {           
    const { nombres, email, proveedorId, compraId, observaciones } = req.body
      Promise.all([CompraService.getItem(compraId),CompraItemsService.getItems(compraId)])
        .then(([xcompra,xitems])=>{   
      
          EmpresaService.getSingle(1)
            .then((xempresa)=>{
              Promise.all([createPdfs(xcompra,xitems,nombres,email,observaciones)])           
                .then(([pdf]) => {
                  MailService.getCotizacion(compraId,xempresa,nombres,email)
                    .then((mail)=>{
                      res.status(200).send({message:"cotizacion enviada", result: mail });    
                    })
                    .catch((reason) => {                            
                      res.status(400).send({ message: reason });
                    });
                })
            })
        })
  }  


    
}



export default MailController;
