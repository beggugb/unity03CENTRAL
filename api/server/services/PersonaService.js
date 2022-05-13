import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Persona } = database;

class PersonaService {

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Persona.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [[prop,value]],
              attributes:["id","nombres","paterno","materno","telefono","celular"]              
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

  static getTotal(){
    return new Promise((resolve,reject) =>{
      Persona.findOne({
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
      Persona.destroy({ where: { id: Number(datoId) } })
        .then((rows) => resolve({ message: 'eliminado' }))
        .catch((reason)  => reject({ message: reason.message }))      
    });
}

  static search(prop,value){
    return new Promise((resolve,reject) =>{            
        let iValue = '%' + value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Persona.findAndCountAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 12,            
            where: {[Op.and]: [
              { [prop]:{ [Op.iLike]: iValue }},             
              { id: { [Op.gt]: 1 }},     
            ]},
            order: [[prop,'ASC']],
            attributes:["id","nombres","paterno","materno","telefono","celular"] 
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
          Persona.findOne({
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

 
    static getItem(pky){
        return new Promise((resolve,reject) =>{
            Persona.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }    
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Persona.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Persona.create(value)
            .then((row) => resolve(row.id))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  

    
}
export default PersonaService;
