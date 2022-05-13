import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Almacen } = database;

class AlmacenService {

    static getItem(pky){
        return new Promise((resolve,reject) =>{
            Almacen.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }    
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Almacen.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Almacen.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } 
    
    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Almacen.findAndCountAll({
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
          Almacen.destroy({ where: { id: Number(datoId) } })
            .then((rows) => resolve({ message: 'eliminado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        });
    }
    
    
    
    
    static search(prop,value){
      return new Promise((resolve,reject) =>{            
          let iValue = '%' + value + '%'
          if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
          Almacen.findAndCountAll({
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

    static getItemSucursal(sucursalId){
        return new Promise((resolve,reject) =>{
            Almacen.findOne({
              raw: true,
              nest: true,
              where: { sucursalId: sucursalId}
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    } 
    static getItems(){
        return new Promise((resolve,reject) =>{
            Almacen.findAll({
              raw: true,
              nest: true,                
              order: [['nombre','ASC']],
              attributes:[['nombre','label'],['id','value']],  
              /*[Op.lt]*/
              where: {[Op.and]: [
                { id: { [Op.lt]: 100}}                
               ]},
              })
            .then((row) => resolve(row))
            .catch((reason) => reject({ message: reason.message }))
        })
    }  
    
}
export default AlmacenService;
