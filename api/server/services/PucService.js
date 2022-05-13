import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Puc } = database;

class PucService {

  static getItems(prop,value){
    return new Promise((resolve,reject) =>{      
        Puc.findAll({
          raw: true,
          nest: true,        
          limit:10,        
          order: [['codigo','ASC']],
          where: { [prop]: { [Op.iLike]: '%'+value+'%' }}           
          })
        .then((row) => resolve(row))
        .catch((reason) => reject({ message: reason.message }))
    })
  }  

  static delete(datoId) {
    return new Promise((resolve, reject) => {
      Puc.destroy({ where: { id: Number(datoId) } })
        .then((rows) => resolve({ message: 'eliminado' }))
        .catch((reason)  => reject({ message: reason.message }))      
    });
  }

  static search(pag,num,prop,value){
    return new Promise((resolve,reject) =>{ 
      let page = parseInt(pag);
      let der = num * page - num;            
        let iValue = value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Puc.findAndCountAll({
            raw: true,
            nest: true,
            offset: der,
            limit: num,
            where: { [prop]: { [Op.iLike]: iValue }},            
            order: [[prop,'ASC']],            
        })		
        .then((rows) => resolve({
            paginas: Math.ceil(rows.count / num),
            pagina: page,
            total: rows.count,
            data: rows.rows
        } 
        ))
    .catch((reason)  => reject({ message: reason.message })) 
     })
   }

    static verificar(nit) {      
        return new Promise((resolve, reject) => {        
          Puc.findOne({
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

    static getData(pag,num,nivel){
        return new Promise((resolve,reject) =>{

          let page = parseInt(pag);
          let der = num * page - num;
            Puc.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [['codigo','asc']],
              where: { nivel:{ [(nivel === 0 || nivel === '0') ? Op.gt:Op.eq]: nivel}}             
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
            Puc.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }    
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Puc.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Puc.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  
  

    
}
export default PucService;
