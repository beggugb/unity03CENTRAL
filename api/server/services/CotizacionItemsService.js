import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { CotizacionItem, Articulo, Marca, Categoria, Unidad   } = database;

class CotizacionItemsService {
    static getInformeData(){
        return new Promise((resolve,reject) =>{      
            CotizacionItem.findAll({
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

   
    static getList(cotizacion){
        return new Promise((resolve,reject) =>{          
          CotizacionItem.findAll({
              raw: true,
              nest: true,              
              order: [['id','ASC']],
              where: { cotizacionId: cotizacion},
              attributes:["id","articuloId","cantidad"]              
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    
    static setAdd(data){
        return new Promise((resolve,reject) =>{
            CotizacionItem.bulkCreate(data,{individualHooks: true})
             .then((rows) => resolve({ message: 'cotizacion registrada' }))
             .catch((reason)  => reject({ message: reason.message }))      
         })
    } 
    static delete(id){
        return new Promise((resolve,reject) =>{
            CotizacionItem.destroy({ where: { cotizacionId: Number(id) } })
            .then((items) => resolve(items))
            .catch((reason)  => reject(reason));
        })
    } 
    static getItems(cotizacionId){
        return new Promise((resolve,reject) =>{            
            CotizacionItem.findAll({
              raw: true,
              nest: true,                
              order: [['id','DESC']],
              where:{cotizacionId : cotizacionId},
              attributes:["id","unidad","cantidad","codigo","subTotal","cotizacionId","articuloId","valor"],
              include: [{ 
                model: Articulo, as: "articulo",                            
                attributes:['id','codigo','codigoBarras','nombreCorto','nombre','precioVenta','filename','categoriaId'],
                /*    include:[
                        {model:Unidad,as:"unidad",attributes:["id","nombre"]}
                    ]  */          
                }]
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))            
        })
    }
/*
    static getInformeData(){
        return new Promise((resolve,reject) =>{      
            CotizacionItem.findAll({
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
export default CotizacionItemsService; 
