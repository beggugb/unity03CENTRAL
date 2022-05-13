import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Asiento, Puc, Comprobante } = database;

class AsientoService {

  static delete(datoId) {
    return new Promise((resolve, reject) => {
      Asiento.destroy({ where: { comprobanteId: Number(datoId) } })
        .then((rows) => resolve({ message: 'eliminado' }))
        .catch((reason)  => reject({ message: reason.message }))      
    });
}

  static search(prop,value){
    return new Promise((resolve,reject) =>{            
        let iValue = '%' + value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Asiento.findAndCountAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 12,
            /*where: { [prop]: { [Op.iLike]: iValue }},*/
            where: {[Op.and]: [
              { [prop]:{ [Op.iLike]: iValue }},             
              { id: { [Op.gt]: 1 }},     
            ]},
            order: [[prop,'ASC']],            
        })		
        .then((rows) => resolve({
            paginas: Math.ceil(rows.count / 12),
            pagina: 1,
            total: rows.count,
            data: rows.rows
        } 
        ))
    .catch((reason)  => reject({ message: reason.message })) 
     })
   }

    static verificar(nit) {      
        return new Promise((resolve, reject) => {        
          Asiento.findOne({
            raw: true,
            nest: true,            
              where : { nit: {[Op.eq]: nit }}
          })           
            .then((result) => {                              
                resolve(result)
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });             
        });
      }

    static getData(comprobanteId){
        return new Promise((resolve,reject) =>{          
            Asiento.findAndCountAll({
              raw: true,
              nest: true,              
              order: [['id','asc']],
              where : { comprobanteId: {[Op.eq]: comprobanteId }},
              include:[                
                {
                    model:Puc,
                    as:"puc",
                    attributes:["id","codigo","descripcion"],                                               
                },
              ]
            })
            .then((rows) => resolve({              
              total: rows.count,
              data: rows.rows
            }))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    static getItem(pky){
        return new Promise((resolve,reject) =>{
            Asiento.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }    
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Asiento.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(data){
      return new Promise((resolve,reject) =>{
        Asiento.bulkCreate(data,{individualHooks: true})
          .then((rows) => resolve({ message: 'asientos registrada' }))
          .catch((reason)  => reject({ message: reason.message }))      
      })
  }

  static getMayores(desde,hasta,pucId){
    return new Promise((resolve,reject) =>{   
        Asiento.findAll({
            raw: true,
            nest: true,            
            /*where: { pucId: { [Op.eq]: pucId }},            */
            where: {[Op.and]: [
              { fechaAsiento: { [Op.between]: [desde, hasta]}},
              { pucId: { [Op.eq]: pucId }}
             ]},
            order: [['comprobanteId','ASC']],    
            attributes:["id","debe","haber","comprobanteId","fechaAsiento"],
            include:[                              
              {
                model:Comprobante,
                as:"comprobante",
                attributes:["id","estado","glosaComprobante"],                                               
            },
            ]        
        })		
        .then((rows) => resolve(rows))
    .catch((reason)  => reject({ message: reason.message })) 
     })
   }

   static getDiarios(desde,hasta,gestion){
    return new Promise((resolve,reject) =>{   
      console.log(gestion)
        Asiento.findAll({
            raw: true,
            nest: true,                                 
            order: [['comprobanteId','ASC']],    
            attributes:["id","debe","haber","comprobanteId"],
            where: { fechaAsiento: { [Op.between]: [desde, hasta]}},
            include:[                              
              {
                model:Puc,
                as:"puc",
                attributes:["id","descripcion","codigo"],                                               
            },
            ]        
        })		
        .then((rows) => resolve(rows))
    .catch((reason)  => reject({ message: reason.message })) 
     })
   }

   static getListPuc(desde,hasta){
    return new Promise((resolve,reject) =>{   
      Asiento.findAll({
            raw: true,
            nest: true,                 
            attributes:['pucId'],           
            order: [['pucId','ASC']],        
            where: { fechaAsiento: { [Op.between]: [desde, hasta]}},   
            include:[                              
              {
                model:Puc,
                as:"puc",
                attributes:["id","codigo","descripcion"],                                               
            },
            ],                                                                                    
            group: ['pucId','puc.id','puc.codigo','puc.descripcion']            
        })		
        .then((rows) => resolve(rows))
    .catch((reason)  => reject({ message: reason.message })) 
     })
   }

   static getSaldos(desde,hasta,pucId){
    return new Promise((resolve,reject) =>{   
        Asiento.findAll({
            raw: true,
            nest: true,            
            /*where: { pucId: { [Op.eq]: pucId }},            */
            where: {[Op.and]: [
              { fechaAsiento: { [Op.between]: [desde, hasta]}},
              { pucId: { [Op.eq]: pucId }}
             ]},
            order: [['comprobanteId','ASC']],    
            attributes:["id","debe","haber","comprobanteId"],
            include:[                              
              {
                model:Puc,
                as:"puc",
                attributes:["id","codigo","descripcion","tipo"],                                               
            },
            ]
        })		
        .then((rows) => resolve(rows))
    .catch((reason)  => reject({ message: reason.message })) 
     })
   }
  

    
}
export default AsientoService;
