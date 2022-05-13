import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Prospecto, ProspectoCliente, Cliente } = database;

class ProspectoClienteService {

    static delete(datoId) {
        return new Promise((resolve, reject) => {
            ProspectoCliente.destroy({ where: { id: Number(datoId) } })
            .then((rows) => resolve({ message: 'eliminado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        });
    }

    static setAdd(value){
        return new Promise((resolve,reject) =>{
            ProspectoCliente.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } 

    static getList(prospecto){
        return new Promise((resolve,reject) =>{          
          ProspectoCliente.findAll({
              raw: true,
              nest: true,              
              order: [['id','ASC']],
              where: { prospectoId: prospecto},
              attributes:["id","clienteId","prospectoId","nroMensajes","nroEmail","estado"],
              include:[{ model:Cliente,as:"cliente",attributes:["id","nombres","filename","email","telefono"]}],                               
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    static getListSingle(prospecto){
      return new Promise((resolve,reject) =>{          
        ProspectoCliente.findAll({
            raw: true,
            nest: true,              
            order: [['id','ASC']],
            where: { prospectoId: prospecto},
            attributes:["id"],
            include:[{ model:Cliente,as:"cliente",attributes:["id","nombres","email","telefono"]}],                               
          })
          .then((rows) => resolve(rows))
          .catch((reason) => reject({ message: reason.message }))
      })
  }

  /*static getInformeData(){
    return new Promise((resolve,reject) =>{      
        ProspectoCliente.findAll({
          raw: true,
          nest: true,          
          limit: 10,              
          attributes: [[Sequelize.fn('sum',Sequelize.col('cantidad')),'suma'],"articuloId"],
          include:[{ model:Articulo,as:"articulo",attributes:["nombre"]}],               
          group: ['articuloId','nombre']  
        })
        .then((rows) => resolve(rows))
        .catch((reason) => reject({ message: reason.message }))
    })
  }


    
   
    static getItems(compra){
        return new Promise((resolve,reject) =>{          
          ProspectoCliente.findAll({
              raw: true,
              nest: true,              
              order: [['id','ASC']],
              where: { compraId: compra},
              attributes:["id","articuloId","codigo","valor","categoria","marca","cantidad","compraId"],
              include:[{
                model:Articulo,as:"articulo",attributes:["id","nombre","codigo","filename"],
                include:[
                  { model:Categoria,as:"categoria",attributes:["id","nombre"]},
                  { model:Marca,as:"marca",attributes:["id","nombre"]}
              ]
              }]  
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    static getList(compra){
        return new Promise((resolve,reject) =>{          
          ProspectoCliente.findAll({
              raw: true,
              nest: true,              
              order: [['id','ASC']],
              where: { compraId: compra},
              attributes:["id","articuloId","cantidad"]              
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
/*
    static getInformeData(){
        return new Promise((resolve,reject) =>{      
            ProspectoCliente.findAll({
              raw: true,
              nest: true,          
              limit: 10,              
              attributes: [[Sequelize.fn('sum',Sequelize.col('cantidad')),'suma'],"articuloId"],
              include:[{
                model:Articulo,as:"articulo",attributes:["nombre"]               
              }],               
              group: ['articuloId','nombre']  
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    */
}
export default ProspectoClienteService;
