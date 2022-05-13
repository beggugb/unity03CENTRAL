import ProcesoService from "../services/ProcesoService";

class ProcesoController {  
    
      static getData(req, res) {                           
        ProcesoService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
            .then((data) => {       
                let resData = data.data.map((item,index)=>{
                    let iok = {
                    "id"        : item.id,   
                    "estado"    : item.estado,
                    "usuarioId" : item.usuarioId,
                    "numero"    : item.comprobante.numComprobante,
                    "monto"     : item.comprobante.montoTotal,
                    "glosa"     : item.comprobante.glosaComprobante,
                    "tipo"      : item.comprobante.tipoComprobante,
                    "fecha"     : item.comprobante.fechaComprobante
                    }
                return iok;
                })          
                res.status(200).send({message:"procesos lista", result: {data: resData, total: data.total, pagina: data.pagina,paginas:data.paginas} }); 
            })                   
            .catch((reason) => {              
              res.status(400).send({ message: reason });
            });         
      }    
}

export default ProcesoController;
