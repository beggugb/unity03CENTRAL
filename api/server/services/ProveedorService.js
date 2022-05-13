import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Proveedor } = database;

class ProveedorService {

  static delete(datoId) {
    return new Promise((resolve, reject) => {
      Proveedor.destroy({ where: { id: Number(datoId) } })
        .then((rows) => resolve({ message: 'eliminado' }))
        .catch((reason)  => reject({ message: reason.message }))      
    });
  }
  
  static getData(pag,num,prop,value){
    return new Promise((resolve,reject) =>{
      let page = parseInt(pag);
      let der = num * page - num;
      Proveedor.findAndCountAll({
          raw: true,
          nest: true,
          offset: der,
          limit: num,
          order: [[prop,value]],
          where: { id: { [Op.gt]: 1 }},
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
      Proveedor.findByPk(pky,{
          raw: true,
          nest: true
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
}    
static setUpdate(value,id){
    return new Promise((resolve,reject) =>{
      Proveedor.update(value, { where: { id: Number(id) } })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message })) 
    })
}

static setAdd(value){
    return new Promise((resolve,reject) =>{
        Proveedor.create(value)
        .then((row) => resolve( row ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
}  

  static search(prop,value){
    return new Promise((resolve,reject) =>{            
        let iValue = '%' + value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Proveedor.findAndCountAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 15,          
            where: {[Op.and]: [
              { [prop]:{ [Op.iLike]: iValue }},             
              { id: { [Op.gt]: 1 }},     
            ]},             
            order: [[prop,'ASC']],
            attributes:["id","razonSocial","codigo","nit","tipoFiscal","filename","direccion","email","telefono"] 
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

   static getTotal(){
    return new Promise((resolve,reject) =>{
      Proveedor.findOne({
          raw:true,
          nest:true,
          attributes: [[Sequelize.fn('count',Sequelize.col('id')),'total']]         

        })
        .then((row) => resolve( row.total ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
} 
    
}
export default ProveedorService;
