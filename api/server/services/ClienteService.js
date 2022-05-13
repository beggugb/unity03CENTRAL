import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Cliente } = database;

class ClienteService {

  static licencia(licencia) {      
    return new Promise((resolve, reject) => {    
      let d     = new Date()
      let flicencia = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]       
      Cliente.findOne({
        raw: true,
        nest: true,            
        attributes:["id","licencia","fechaVencimiento","nombres"], 
        where :  {
          [Op.and]: [
              { licencia: {[Op.eq]: licencia }},
              /*{ fechaVencimiento: {[Op.gte]: flicencia }}*/
          ] 
        }
      })           
        .then((result) => {                              
            resolve(result)
        })
        .catch((reason) => {                
            reject({ message: reason.message })
          });             
    });
  }

  //Informe Cliente
  static getClientesRango(desde,hasta){
    return new Promise((resolve,reject) =>{        
      Cliente.findAndCountAll({
          raw:true,
          nest:true,          
          where: {[Op.and]: [
            { createdAt: { [Op.between]: [desde, hasta]}},            
           ]},
          attributes:["id","createdAt","codigo","pais","nombres","nit","email","telefono"]          
        })
        .then((rows) => resolve({                    
          total: rows.count,
          data: rows.rows          
        }))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }

  static getTotal(){
    return new Promise((resolve,reject) =>{
      Cliente.findOne({
          raw:true,
          nest:true,
          attributes: [[Sequelize.fn('count',Sequelize.col('id')),'total']] 
        })
        .then((row) => resolve( row.total ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }


 
  static delete(datoId) {
    return new Promise((resolve, reject) => {
      Cliente.destroy({ where: { id: Number(datoId) } })
        .then((rows) => resolve({ message: 'eliminado' }))
        .catch((reason)  => reject({ message: reason.message }))      
    });
}

  static search(prop,value){
    return new Promise((resolve,reject) =>{            
        let iValue = '%' + value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Cliente.findAndCountAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 12,            
            where: {[Op.and]: [
              { [prop]:{ [Op.iLike]: iValue }},             
              { id: { [Op.gt]: 1 }},     
            ]},
            order: [[prop,'ASC']],
            attributes:["id","codigo","nombres","email","direccion","tipo","nit","filename","telefono"] 
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
          Cliente.findOne({
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

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Cliente.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [[prop,value]],
              attributes:["id","codigo","nombres","email","direccion","tipo","nit","filename","telefono"],
              where: { id: { [Op.gt]: 1 }}, 
            })
            .then((rows) => resolve({
              paginas: Math.ceil(rows.count / num),
              pagina: page,
              total: rows.count,
              data: rows.rows
            }))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    static getItem(pky){
        return new Promise((resolve,reject) =>{
            Cliente.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }   
    static getItemSingle(pky){
      return new Promise((resolve,reject) =>{
          Cliente.findByPk(pky,{
            raw: true,
            nest: true,
            attributes:["id","codigo","nombres","email","tipo","telefono","pais","ciudad","direccion","nit"]
          })
          .then((row)=> resolve( row ))
          .catch((reason) => reject({ message: reason.message }))
      })
  }  
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Cliente.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Cliente.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  
/*    static getTotal(){
      return new Promise((resolve,reject) =>{
        Cliente.findOne({
            raw:true,
            nest:true,
            attributes: [[Sequelize.fn('count',Sequelize.col('id')),'total']]         
  
          })
          .then((row) => resolve( row.total ))
          .catch((reason)  => reject({ message: reason.message }))  
      })
    }
*/
    
}
export default ClienteService;
