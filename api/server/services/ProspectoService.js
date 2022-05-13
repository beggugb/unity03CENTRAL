import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Prospecto, Articulo, Categoria, Marca } = database;

class ProspectoService {

  //Informe Prospectos
  static getProspectoRango(desde,hasta){
    return new Promise((resolve,reject) =>{        
      Prospecto.findAndCountAll({
          raw:true,
          nest:true,          
          where: {[Op.and]: [
            { fecha: { [Op.between]: [desde, hasta]}},            
           ]},
          attributes:["id","fecha","nombre","tipo","observaciones","articuloId"],
          include:[
            {model:Articulo,as:"articulo",attributes:["id","nombre"]}            
          ]          
        })
        .then((rows) => resolve({                    
          total: rows.count,
          data: rows.rows          
        }))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }

  //Total Cantidad
  static getTotals(gestion){
    return new Promise((resolve,reject) =>{            
      Prospecto.findOne({
          raw:true,
          nest:true,
          where: { gestion: gestion },
          attributes: [  
          [Sequelize.fn('count',Sequelize.col('id')),'total']]              
        })
        .then((row) => resolve( row ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }
  static getItemArticulo(pky){
    return new Promise((resolve,reject) =>{
        Prospecto.findByPk(pky,{
          raw: true,
          nest: true,
          attributes:["id","fecha","nombre","tipo","observaciones"],
          include:[
            {model:Articulo,as:"articulo",
            attributes:["id","codigo","codigoBarras","nombre","nombreCorto","filename","precioVenta","descripcion"],
            include:[
              {model:Categoria,as:"categoria",attributes:["id","nombre"]},
              {model:Marca,as:"marca",attributes:["id","nombre"]}
            ]
            },            
          ]

        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
}

  static getTotal(){
    return new Promise((resolve,reject) =>{
      Prospecto.findOne({
          raw:true,
          nest:true,
          attributes: [[Sequelize.fn('count',Sequelize.col('id')),'total']] 
        })
        .then((row) => resolve( row.total ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }


 
  static delete(datoId) {
    return new Promise((resolve, reject) => {
      Prospecto.destroy({ where: { id: Number(datoId) } })
        .then((rows) => resolve({ message: 'eliminado' }))
        .catch((reason)  => reject({ message: reason.message }))      
    });
}

  static search(prop,value){
    return new Promise((resolve,reject) =>{            
        let iValue = '%' + value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Prospecto.findAndCountAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 12,            
            where: {[Op.and]: [
              { [prop]:{ [Op.iLike]: iValue }},             
              { id: { [Op.gt]: 1 }},     
            ]},
            order: [[prop,'ASC']],
            /*attributes:["id","codigo","nombres","email","direccion","tipo","nit","filename","telefono"] */
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

    static verificar(nit) {      
        return new Promise((resolve, reject) => {        
          Prospecto.findOne({
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

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Prospecto.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [[prop,value]],
              attributes:["id","fecha","nombre","tipo","vencimiento","nivel","estado","observaciones"],
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
            Prospecto.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }    
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Prospecto.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Prospecto.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  

    
}
export default ProspectoService;
