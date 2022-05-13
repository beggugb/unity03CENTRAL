import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { ExperienciaLaboral } = database;

class ExperienciasService {  
  static getItem(pky){
    return new Promise((resolve,reject) =>{
      ExperienciaLaboral.findByPk(pky,{
          raw: true,
          nest: true,          
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }  
    static delete(datoId) {
      return new Promise((resolve, reject) => {
        ExperienciaLaboral.destroy({ where: { id: Number(datoId) } })
          .then((rows) => resolve({ message: 'eliminado' }))
          .catch((reason)  => reject({ message: reason.message }))      
      });
    }
  
    static setUpdate(value,id){
      return new Promise((resolve,reject) =>{
        ExperienciaLaboral.update(value, { where: { id: Number(id) } })
          .then((row)=> resolve( row ))
          .catch((reason) => reject({ message: reason.message })) 
      })
    }

    static setAdd(value){
        return new Promise((resolve,reject) =>{
          ExperienciaLaboral.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }   

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
          ExperienciaLaboral.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [['desde','asc']],
              where: { personaId:  prop },
              attributes:["id","empresa","desde","hasta","ciudad","pais","motivo","contacto","telefono"],              
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
export default ExperienciasService;
