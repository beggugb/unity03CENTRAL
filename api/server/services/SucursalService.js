import database from "../../src/models";

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { Tarea } = database;

class TareaService {  

  static getList(usuarioId, start, end) {        
    return new Promise((resolve, reject) => {        
        Tarea.findAll({
            order: [['start', 'DESC']],            
            where: {
              [Op.and]: [            
                { usuarioId: { [Op.eq]: usuarioId } },                    
                { start: {[Op.between]: [start, end ]}},
              ]
            },    
        })
        .then((tareas) => {                
                resolve({ message: "Lista tareas", data: tareas })
            })
        .catch((reason) => {                
                reject({ message: reason.message, data: null })
         });
       });
   }
}

export default TareaService;
