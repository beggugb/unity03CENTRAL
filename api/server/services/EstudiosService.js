import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { EstudiosPersona, Universidad } = database;

class EstudiosService {  
   
  static getItem(pky){
    return new Promise((resolve,reject) =>{
      EstudiosPersona.findByPk(pky,{
          raw: true,
          nest: true,          
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }  
    static delete(datoId) {
      return new Promise((resolve, reject) => {
        EstudiosPersona.destroy({ where: { id: Number(datoId) } })
          .then((rows) => resolve({ message: 'eliminado' }))
          .catch((reason)  => reject({ message: reason.message }))      
      });
    }
  
    static setUpdate(value,id){
      return new Promise((resolve,reject) =>{
        EstudiosPersona.update(value, { where: { id: Number(id) } })
          .then((row)=> resolve( row ))
          .catch((reason) => reject({ message: reason.message })) 
      })
    }

    static setAdd(value){
        return new Promise((resolve,reject) =>{
          EstudiosPersona.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } 

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
          EstudiosPersona.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [['fecha','asc']],
              where: { personaId:  prop },
              attributes:["id","carrera","fecha","ciudad","pais","nivel","estado","personaId","institucion"],             
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
   
    
}
export default EstudiosService;
