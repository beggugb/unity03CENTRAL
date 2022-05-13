import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { MovimientoItem, Articulo, Categoria, Marca } = database;

class MovimientoItemService {

  //Get Items Single
  static getItemsSingle(movimiento){
    return new Promise((resolve,reject) =>{          
      MovimientoItem.findAll({
          raw: true,
          nest: true,              
          order: [['id','ASC']],
          where: { movimientoId: movimiento},
          attributes:["id","articuloId","codigo","valor","unidad","cantidad","movimientoId"]               
        })
        .then((rows) => resolve(rows))
        .catch((reason) => reject({ message: reason.message }))
    })
  }
  //Get Items Compuesto
  static getItems(movimiento){
    return new Promise((resolve,reject) =>{          
      MovimientoItem.findAll({
          raw: true,
          nest: true,              
          order: [['id','ASC']],
          where: { movimientoId: movimiento},
          attributes:["id","articuloId","codigo","valor","unidad","cantidad","movimientoId"],
          include:[{
            model:Articulo,as:"articulo",attributes:["id","nombre","codigo","filename"],
            /*include:[
              { model:Categoria,as:"categoria",attributes:["id","nombre"]},
              { model:Marca,as:"marca",attributes:["id","nombre"]}
          ]*/
          }]  
        })
        .then((rows) => resolve(rows))
        .catch((reason) => reject({ message: reason.message }))
    })
}

  static getInformeData(gestion){
    return new Promise((resolve,reject) =>{      
        MovimientoItem.findAll({
          raw: true,
          nest: true,          
          limit: 10,       
          where: { gestion: gestion },       
          attributes: [[Sequelize.fn('sum',Sequelize.col('cantidad')),'suma'],"articuloId"],
          include:[{ model:Articulo,as:"articulo",attributes:["nombre"]}],               
          group: ['articuloId','nombre']  
        })
        .then((rows) => resolve(rows))
        .catch((reason) => reject({ message: reason.message }))
    })
  }


    static setAdd(data){
        return new Promise((resolve,reject) =>{
           MovimientoItem.bulkCreate(data,{individualHooks: true})
            .then((rows) => resolve({ message: 'movimientos registrada' }))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static delete(datoId) {
        return new Promise((resolve, reject) => {
          MovimientoItem.destroy({ where: { movimientoId: Number(datoId) } })
            .then((rows) => resolve({ message: 'eliminado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        });
    }
    
    static getList(movimiento){
        return new Promise((resolve,reject) =>{          
          MovimientoItem.findAll({
              raw: true,
              nest: true,              
              order: [['id','ASC']],
              where: { movimientoId: movimiento},
              attributes:["id","articuloId","cantidad","valor"],
              include:[{ model:Articulo,as:"articulo",attributes:["categoriaId"]}],              
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
/*
    static getInformeData(){
        return new Promise((resolve,reject) =>{      
            MovimientoItem.findAll({
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
export default MovimientoItemService;
