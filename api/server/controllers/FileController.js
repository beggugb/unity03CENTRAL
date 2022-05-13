import FileService from "../services/FileService";
import ArticuloService from "../services/ArticuloService";
import ProveedorService from "../services/ProveedorService";
import ClienteService from "../services/ClienteService";
import EmpresaService from "../services/EmpresaService"
import PersonaService from "../services/PersonaService"

class FileController {  

    static proveedores(req, res) { 
        FileService.proveedores(req, res)
          .then((file) => {
            const art = {}
            art.filename = file.filename
            ProveedorService.setUpdate(art, req.params.id)
              .then((result) => {
                    res.status(200).send({ result })
                  })
          })
          .catch(reason => {
       
            res.status(400).send({ 'message': reason })
          })
   
      }	

    static articulos(req, res) {      
        FileService.articulos(req, res)
          .then((file) => {
            const art = {}
            art.filename = file.filename
            ArticuloService.setUpdate(art, req.params.id)
              .then((result) => {
                    res.status(200).send({ result })
                  })
          })
          .catch(reason => {
           
            res.status(400).send({ 'message': reason })
          })
        
      }
     
    static clientes(req, res) {
 
        FileService.clientes(req, res)        
          .then((file) => {
            const art = {}
            art.filename = file.filename
            ClienteService.setUpdate(art, req.params.id)
              .then((result) => { res.status(200).send({ result })   })
          })
          .catch(reason => {          
            res.status(400).send({ 'message': reason })
          })   
    }
    static clientesNit(req, res) {
  
        FileService.clientesNit(req, res)        
          .then((file) => {
            const art = {}
            art.filenameNit = file.filename
            ClienteService.setUpdate(art, req.params.id)
              .then((result) => { res.status(200).send({ result })   })
          })
          .catch(reason => {          
            res.status(400).send({ 'message': reason })
          })   
    }
    static clientesCi(req, res) {
  
        FileService.clientesCi(req, res)        
          .then((file) => {
            const art = {}
            art.filenameCi = file.filename
            ClienteService.setUpdate(art, req.params.id)
              .then((result) => { res.status(200).send({ result })   })
          })
          .catch(reason => {          
            res.status(400).send({ 'message': reason })
          })   
    }
    static empresa(req, res) {
      FileService.empresa(req, res)
        .then((file) => {
          const art = {}
          art.filename = file.filename
          EmpresaService.setUpdate(art, req.params.id)
            .then((result) => { res.status(200).send({ result })   })
        })
        .catch(reason => {          
          res.status(400).send({ 'message': reason })
        })   
    } 
    static persona(req, res) {
      FileService.persona(req, res)
        .then((file) => {
          const art = {}
          art.filename = file.filename
          PersonaService.setUpdate(art, req.params.id)
            .then((result) => { res.status(200).send({ result })   })
        })
        .catch(reason => {          
          res.status(400).send({ 'message': reason })
        })   
    }   
    
}

export default FileController;
