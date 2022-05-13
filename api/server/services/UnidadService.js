import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Unidad } = database;

class UnidadService {

    static getList(prop,value){
        return new Promise((resolve,reject) =>{
            Unidad.findAll({
              raw: true,
              nest: true,                
              order: [[prop,value]],
              attributes:[[prop,'label'],['id','value']]  
              })
            .then((row) => resolve(row))
            .catch((reason) => reject({ message: reason.message }))
        })
    }

    static getItem(pky){
        return new Promise((resolve,reject) =>{
            Unidad.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }    
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Unidad.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Unidad.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } 

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Unidad.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [[prop,value]]
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

    static delete(datoId) {
        return new Promise((resolve, reject) => {
          Unidad.destroy({ where: { id: Number(datoId) } })
            .then((rows) => resolve({ message: 'eliminado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        });
    }

   
   

    static search(prop,value){
      return new Promise((resolve,reject) =>{            
          let iValue = '%' + value + '%'
          if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
          Unidad.findAndCountAll({
              raw: true,
              nest: true,
              offset: 0,
              limit: 12,
              where: { [prop]: { [Op.iLike]: iValue }},
              order: [[prop,'ASC']]
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

    static getItems(categoriaId){        
        return new Promise((resolve,reject) =>{            

            Unidad.findAll({
              raw: true,
              nest: true,                
              order: [['nombre','ASC']],
              attributes:[['nombre','label'],['id','value']]              
              })
            .then((row) => resolve(row))
            .catch((reason) => reject({ message: reason.message }))
        })
    } 
    
}
export default UnidadService;
