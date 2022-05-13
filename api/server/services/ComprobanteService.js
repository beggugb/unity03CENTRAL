import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Comprobante } = database;

class ComprobanteService {


  static getComprobanteLast(gestion,estado){
    return new Promise((resolve,reject) =>{    
      console.log(gestion)    
      console.log(estado)    
        Comprobante.findAll({
          raw: true,
          nest: true,    
          limit: 15,                
          order: [['fechaComprobante','desc']],
          attributes:["id","fechaComprobante","tipoComprobante","numComprobante","gestion","glosaComprobante","estado"],
          where: {[Op.and]: [            
            { gestion: { [Op.eq]: gestion.toString() }},
            { estado: estado} 
          ]},
        })
        .then((rows) => resolve(
          rows
        ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }

  static verificar(pky) {      
    return new Promise((resolve, reject) => {        
      Comprobante.findOne({
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

  static delete(datoId) {
    return new Promise((resolve, reject) => {
      Comprobante.destroy({ where: { id: Number(datoId) } })
        .then((rows) => resolve({ message: 'eliminado' }))
        .catch((reason)  => reject({ message: reason.message }))      
    });
}

  static search(gestion,prop,value){
    return new Promise((resolve,reject) =>{            
        let iValue = '%' + value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Comprobante.findAndCountAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 15,            
            where: {[Op.and]: [
              { [prop]:{ [Op.iLike]: iValue }},             
              { id: { [Op.gt]: 1 }},     
              { gestion: { [Op.eq]: gestion.toString() }} 
            ]},
            order: [['fechaComprobante','DESC']],            
        })		
        .then((rows) => resolve({
            paginas: Math.ceil(rows.count / 15),
            pagina: 1,
            total: rows.count,
            data: rows.rows
        } 
        ))
    .catch((reason)  => reject({ message: reason.message })) 
     })
   }

    

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Comprobante.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [[prop,value]],
              attributes:["id","fechaComprobante","tipoComprobante","estado","label","numComprobante","glosaComprobante","montoTotal","gestion"]
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
            Comprobante.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }    
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Comprobante.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Comprobante.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  

    static getLastItem(ptipo,gestion){
      return new Promise((resolve,reject) =>{   
          Comprobante.findOne({
            raw: true,
            nest: true,
            limit:1,
            where: {[Op.and]: [
              { tipoComprobante: {[Op.eq]: ptipo }},             
              { gestion: { [Op.eq]: gestion.toString() }}     
            ]},
            order: [['numComprobante','desc']]
          })
          .then((row )=> resolve( row ))
          .catch((reason) => reject({ message: reason.message }))
      })
    } 
    static getList(desde,hasta,gestion){
      return new Promise((resolve,reject) =>{        
          Comprobante.findAll({
            raw: true,
            nest: true,                    
            order: [['id','asc']],
            attributes:["id","gestion","glosaComprobante"]
          })
          .then((rows) => resolve(
            rows
          ))
          .catch((reason) => reject({ message: reason.message }))
      })
    }
  

    
}
export default ComprobanteService;
