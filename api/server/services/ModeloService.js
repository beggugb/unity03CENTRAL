import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Modelo } = database;

class ModeloService {

    static getItems(marcaId,categoriaId){
        return new Promise((resolve,reject) =>{
            Modelo.findAll({
              raw: true,
              nest: true,                
              order: [['nombre','ASC']],
              attributes:[['nombre','label'],['id','value']],            
              where :  {[Op.and]: [ { marcaId: {[Op.eq]: marcaId }},{ categoriaId: {[Op.eq]: categoriaId }}]}
            })
            .then((row) => resolve(row))
            .catch((reason) => reject({ message: reason.message }))
        })
    } 
    
}
export default ModeloService;
