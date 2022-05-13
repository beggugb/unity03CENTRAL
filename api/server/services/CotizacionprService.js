import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { CotizacionProveedor, Articulo, Categoria, Marca } = database;

class CotizacionpService {

  static setAdd(data){
        return new Promise((resolve,reject) =>{
           CotizacionProveedor.bulkCreate(data,{individualHooks: true})
            .then((rows) => resolve({ message: 'compras registrada' }))
            .catch((reason)  => reject({ message: reason.message }))      
       })
  }  

  static delete(datoId) {
    return new Promise((resolve, reject) => {
      CotizacionProveedor.destroy({ where: { compraId: Number(datoId) } })
        .then((rows) => resolve({ message: 'eliminado' }))
        .catch((reason)  => reject({ message: reason.message }))      
    });
}

 
  //Get Items Compuesto
  static getItems(compra){
    return new Promise((resolve,reject) =>{          
      CotizacionProveedor.findAll({
          raw: true,
          nest: true,              
          order: [['razonSocial','ASC']],
          where: { compraId: compra},          
        })
        .then((rows) => resolve(rows))
        .catch((reason) => reject({ message: reason.message }))
    })
}

  static getInformeData(gestion){
    return new Promise((resolve,reject) =>{      
        CotizacionProveedor.findAll({
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


    
   
    
    static getList(compra){
        return new Promise((resolve,reject) =>{          
          CotizacionProveedor.findAll({
              raw: true,
              nest: true,              
              order: [['id','ASC']],
              where: { compraId: compra},
              attributes:["id","articuloId","cantidad","valor"],
              include:[{ model:Articulo,as:"articulo",attributes:["categoriaId"]}],              
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))
        })
    }

}
export default CotizacionpService;
