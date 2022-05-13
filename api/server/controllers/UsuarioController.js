import UsuarioService from "../services/UsuarioService";

const bcrypt = require('bcrypt')
class UsuarioController {


  static crear(req, res) {           
    UsuarioService.setAdd(req.body)
        .then((usuario)=>{          
          UsuarioService.getData(1,15,'nombres','asc')
          .then((usuarios)=>{
            res.status(200).send({message:"usuario actualizado", result: { usuarios } });
          })       
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
} 

  static actualizar(req, res) {                           
    if(req.params.tipo === 'dato')
    {
      UsuarioService.setUpdate(req.body,req.params.id)
      .then((xusuario) => {                
        UsuarioService.getItem(req.params.id)
          .then((usuario)=>{
            UsuarioService.getData(1,15,'nombres','asc')
              .then((usuarios)=>{
                res.status(200).send({message:"usuario actualizado", result: { usuarios } });
              })              
          })        
          .catch((reason) => {                        
            res.status(400).send({ message: reason });
          }) 
      })       
    }else{
      const { password }  = req.body
      let dtn = req.body
      dtn.password =  bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
      UsuarioService.setUpdate(dtn,req.params.id)
      .then((xusuario) => {                
        UsuarioService.getItem(req.params.id)
          .then((usuario)=>{
            UsuarioService.getData(1,15,'nombres','asc')
            .then((usuarios)=>{
              res.status(200).send({message:"usuario actualizado", result: { usuarios } });
            })               
          })        
          .catch((reason) => {                        
            res.status(400).send({ message: reason });
          }) 
      })
    }
  }

  static getData(req, res) {                           
    UsuarioService.getData(req.params.pagina,req.params.num,req.params.prop,req.params.orden)
        .then((usuarios) => {                
            res.status(200).send({message:"usuarios lista", result: usuarios });                                               
        })                   
        .catch((reason) => {   
          console.log(reason)           
          res.status(400).send({ message: reason });
        });         
  }

  static getItem(req, res) {                           
    UsuarioService.getItem(req.params.id)
        .then((usuario) => {                                              
            res.status(200).send({message:"usuario item", result:  usuario });
        })                   
        .catch((reason) => {                        
          console.log(reason)
          res.status(400).send({ message: reason });
        });         
  }



  static getItems(req, res) {                   
    UsuarioService.getItems()
        .then((usuarios) => {                
            res.status(200).send({message:"usuarios lista", result: usuarios });                                               
        })                   
        .catch((reason) => {              
          res.status(400).send({ message: reason });
        });         
  }

  static login(req, res) {
    const { username, password } = req.body;    
    UsuarioService.login(username, password)
      .then((user) => {          
        if(user.usuario){                             
          res.status(200).send({ user });               
        }else{
          console.log(user)
          res.status(400).send({ message: user.message });
        }        
      })                   
      .catch((reason) => {             
        console.log(reason) 	    
        res.status(400).send({ message: reason });
    });
  }
}


export default UsuarioController;
