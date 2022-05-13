import database from "../../src/models";

const Sequelize = require("sequelize");
const Op = Sequelize.Op;


const { Tarea, Usuario } = database;

class TareaService {  

  static getItem(pky){
    return new Promise((resolve,reject) =>{
      Tarea.findByPk(pky,{
          raw: true,
          nest: true,
          attributes: ["id","title","start","end","backgroundColor","selectable","usuarioId","detalle"]
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
}

  static getList(usuarioId, start, end) {        
    return new Promise((resolve, reject) => {        
        Tarea.findAll({
            order: [['start', 'DESC']],       
            attributes: ["id","title","start","end","backgroundColor","selectable","usuarioId","detalle"],
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

  static getAll(usuarioId, inicio, end) {        
    return new Promise((resolve, reject) => {        
      console.log(usuarioId)      
      console.log(inicio)
      console.log(end)
        Tarea.findAll({
            order: [['start', 'DESC']],    
            attributes: ["id","title","start","end","backgroundColor","selectable","usuarioId","classNames","detalle"],        
            where: {
              [Op.and]: [            
                { usuarioId: { [Op.eq]: usuarioId } },                    
                { start: {[Op.between]: [inicio, end]}} //2021-11-04                
              ]
            },    
        })
        .then((tareas) => {                
                resolve(tareas)
            })
        .catch((reason) => {                
                reject({ message: reason.message, data: null })
         });
       });
   }

  static add(newTarea) {    
    return new Promise((resolve, reject) => {        
        Tarea.create(newTarea)
            .then((result) => {              
                resolve({ message: "success" })
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });           
        
   });
  } 

  static update(newTarea,datoId) {    
    return new Promise((resolve, reject) => {        
      Tarea.update(newTarea, { where: { id: Number(datoId) } })
            .then((result) => {              
                resolve({ message: "success" })
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });           
        
   });
 }







  
}

export default TareaService;
