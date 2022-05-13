import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Tdc } = database;

class TdcService {
  static getHoy(){
    return new Promise((resolve,reject) =>{
      var fechaHoy = new Date()    
      var fHoy = (new Date(fechaHoy + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]  
      var fGestion = fechaHoy.getFullYear()
      Tdc.findOne({
        raw: true,
        nest: true,            
        where :  {
            [Op.and]: [
                { start :{ [Op.eq]: fHoy }},
                { gestion  :{ [Op.eq]: fGestion.toString()  }}
            ] 
        },
        attributes: ["id","monto"], 
      })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }

  static verificar(pky) {      
    var fechaHoy = new Date()    
    var fHoy = (new Date(fechaHoy + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0]  
    var fGestion = fechaHoy.getFullYear()
  
    return new Promise((resolve, reject) => {        
      Tdc.findOne({
        raw: true,
        nest: true,            
        where :  {
            [Op.and]: [
                { start :{ [Op.eq]: fHoy }},
                { gestion       :{ [Op.eq]: fGestion.toString()  }}
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

  static getAll(inicio, end) {        
    return new Promise((resolve, reject) => {              
      console.log(inicio)
      console.log(end)
        Tdc.findAll({
            order: [['start', 'DESC']],    
            attributes: ["id","title","start","end","backgroundColor","selectable","monto","classNames","detalle"],        
            where: {
              [Op.and]: [            
                /*{ usuarioId: { [Op.eq]: usuarioId } },*/
                { start: {[Op.between]: [inicio, end]}} //2021-11-04                
              ]
            },    
        })
        .then((tdcs) => {                
                resolve(tdcs)
            })
        .catch((reason) => {                
                reject({ message: reason.message, data: null })
         });
       });
  }


  static getItem(pky){
    return new Promise((resolve,reject) =>{
      Tdc.findByPk(pky,{
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
        Tdc.findAll({
            order: [['start', 'DESC']],       
            attributes: ["id","title","start","end","backgroundColor","selectable","usuarioId","detalle"],
            where: {
              [Op.and]: [            
                { usuarioId: { [Op.eq]: usuarioId } },                    
                { start: {[Op.between]: [start, end ]}},
              ]
            },    
        })
        .then((tdcs) => {                
                resolve({ message: "Lista tdcs", data: tdcs })
            })
        .catch((reason) => {                
                reject({ message: reason.message, data: null })
         });
       });
   }

  

  static add(newTdc) {    
    return new Promise((resolve, reject) => {        
        Tdc.create(newTdc)
            .then((result) => {              
                resolve({ message: "success" })
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });           
        
   });
  } 

  static update(newTdc,datoId) {    
    return new Promise((resolve, reject) => {        
      Tdc.update(newTdc, { where: { id: Number(datoId) } })
            .then((result) => {              
                resolve({ message: "success" })
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });           
        
   });
 }


 
/*

  static getItem(pky){
    return new Promise((resolve,reject) =>{
        Tdc.findByPk(pky,{
          raw: true,
          nest: true
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
}    
static setUpdate(value,id){
    return new Promise((resolve,reject) =>{
        Tdc.update(value, { where: { id: Number(id) } })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message })) 
    })
}

static setAdd(value){
    return new Promise((resolve,reject) =>{
        Tdc.create(value)
        .then((row) => resolve( row ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
} 

static getData(pag,num,prop,value){
    return new Promise((resolve,reject) =>{
      let page = parseInt(pag);
      let der = num * page - num;
        Tdc.findAndCountAll({
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

  
*/
    
}
export default TdcService;
