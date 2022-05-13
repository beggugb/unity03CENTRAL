import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Salario } = database;

class SalarioService {
    static getList(prop,value){
        return new Promise((resolve,reject) =>{
            Salario.findAll({
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
            Salario.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }    
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Salario.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Salario.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } 

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Salario.findAndCountAll({
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
          Salario.destroy({ where: { id: Number(datoId) } })
            .then((rows) => resolve({ message: 'eliminado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        });
    }

   
   

    static search(prop,value){
      return new Promise((resolve,reject) =>{            
          let iValue = '%' + value + '%'
          if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
          Salario.findAndCountAll({
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
            let iCategoria = categoriaId
            let fCategoria = categoriaId
            
            if(categoriaId === 0 || categoriaId === '0' || categoriaId === 'undefined' ) 
            { iCategoria = 0, fCategoria = 5000 }   

            Salario.findAll({
              raw: true,
              nest: true,                
              order: [['nombre','ASC']],
              attributes:['categoriaId',['nombre','label'],['id','value']],
              where :{categoriaId: {[Op.between]: [iCategoria,fCategoria]}},
              })
            .then((row) => resolve(row))
            .catch((reason) => reject({ message: reason.message }))
        })
    } 
    
}
export default SalarioService;
