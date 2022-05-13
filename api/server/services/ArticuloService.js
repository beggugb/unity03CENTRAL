import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Articulo, Marca, Categoria, Unidad, Modelo   } = database;

class ArticuloService {

  static searchSingle(prop,value){    
    return new Promise((resolve,reject) =>{                        
        Articulo.findAll({
            raw: true,
            nest: true,            
            limit: 15,
            where: { [prop]: { [Op.iLike]: '%'+value+'%' }},
            order: [[prop,'ASC']],
            attributes:["id","codigo","nombre","nombreCorto","descripcion","filename","tipo","codigoBarras"],
            include:[
              {model:Unidad,as:"unidad",attributes:["id","nombre"]},                         
            ]             
        })		
        .then((rows) => resolve(rows))
    .catch((reason)  => reject({ message: reason.message })) 
     })
   }

   

  static getTotal(){
    return new Promise((resolve,reject) =>{
        Articulo.findOne({
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
      Articulo.destroy({ where: { id: Number(datoId) } })
        .then((rows) => resolve({ message: 'eliminado' }))
        .catch((reason)  => reject({ message: reason.message }))      
    });
  }

  static search(prop,value){
    return new Promise((resolve,reject) =>{    
      console.log(prop)        
      console.log(value)        
        let iValue = '%' + value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Articulo.findAndCountAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 12,
            where: { [prop]: { [Op.iLike]: iValue }},
            order: [[prop,'ASC']],
            attributes:["id","codigo","nombre","tipo","codigoBarras"],
            include:[
              {model:Marca,as:"marca",attributes:["id","nombre"]},
              {model:Categoria,as:"categoria",attributes:["id","nombre"]}              
            ] 
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

  static getItem(pky){
    return new Promise((resolve,reject) =>{
        Articulo.findByPk(pky,{
          raw: true,
          nest: true,
          include:[
            {model:Marca,as:"marca",attributes:["id","nombre"]},
            {model:Categoria,as:"categoria",attributes:["id","nombre"]}              
          ]
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }
  static getItemSingle(pky){
    return new Promise((resolve,reject) =>{
        Articulo.findByPk(pky,{
          raw: true,
          nest: true,
          attributes:["id","codigo","codigoBarras","nombre","nombreCorto","precioVenta","filename","descripcion"]
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }
  static getItemStock(pky){
    return new Promise((resolve,reject) =>{
        Articulo.findByPk(pky,{
          raw: true,
          nest: true,
          attributes:["id","codigoBarras","nombre","nm","nv","sma","smi"]
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }

  static getData(pag,num,prop,value){
    return new Promise((resolve,reject) =>{
      let page = parseInt(pag);
      let der = num * page - num;
      Articulo.findAndCountAll({
          raw: true,
          nest: true,
          offset: der,
          limit: num,
          order: [[prop,value]],
          attributes:["id","codigo","nombre","tipo","codigoBarras"],
          include:[
            {model:Marca,as:"marca",attributes:["id","nombre"]},
            {model:Categoria,as:"categoria",attributes:["id","nombre"]}              
          ] 
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

  static getArticulosCompra(value){
    return new Promise((resolve,reject) =>{            
        let iValue = '%' + value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Articulo.findAndCountAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 12,
            where: { "nombre": { [Op.iLike]: iValue }},
            order: [["nombre",'ASC']],
            attributes:["id","codigo","nombre","filename","codigoBarras","precioVenta","descripcion","nombreCorto"],
            include:[
              {model:Marca,as:"marca",attributes:["id","nombre"]},
              {model:Categoria,as:"categoria",attributes:["id","nombre"]}              
            ]
        })		
        .then((rows) => resolve(
          {
            paginas: Math.ceil(rows.count / 12),
            pagina: 1,
            total: rows.count,
            data: rows.rows
        }
      ))
    .catch((reason)  => reject({ message: reason.message })) 
    })
} 
  
  static getList(value){
    return new Promise((resolve,reject) =>{            
        let iValue = '%' + value + '%'
        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
        Articulo.findAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 12,
            where: { "nombre": { [Op.iLike]: iValue }},
            order: [["nombre",'ASC']],
            attributes:["id","codigo","nombre","tipo","origen","precioVenta","precioCosto"],
            include:[
              {model:Marca,as:"marca",attributes:["id","nombre"]},
              {model:Categoria,as:"categoria",attributes:["id","nombre"]},
              {model:Modelo,as:"modelo",attributes:["id","nombre"]},
              {model:Unidad,as:"unidad",attributes:["id","nombre"]},
            ]
        })		
        .then((rows) => resolve(rows)
        )
    .catch((reason)  => reject({ message: reason.message })) 
    })
} 

    static verificar(codigo) {      
        return new Promise((resolve, reject) => {        
          Articulo.findOne({
            raw: true,
            nest: true,            
            where : { codigo: {[Op.eq]: codigo }}
          })           
            .then((result) => {                              
                resolve(result)
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });             
        });
      }
   
        
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Articulo.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  

  /*  static getTotal(){
      return new Promise((resolve,reject) =>{
          Articulo.findOne({
            raw:true,
            nest:true,
            attributes: [
              [Sequelize.fn('count',Sequelize.col('id')),'total']
            ]         

          })
          .then((row) => resolve( row.total ))
          .catch((reason)  => reject({ message: reason.message }))  
      })
  } */

  static setUpdate(value,id){
    return new Promise((resolve,reject) =>{
      Articulo.update(value, { where: { id: Number(id) } })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message })) 
    })
  }
  static sumCategorias(usuarioId) {
    return new Promise((resolve, reject) => {  
        Articulo.findOne({
         raw: true,
         nest: true,                                                                        
         attributes: [[Sequelize.fn('count', Sequelize.col('categoriaId')), 'total']],                          
         })
         .then((articulos) =>
           resolve(articulos)
         )
         .catch((reason) => reject(reason));
     });
  }

  static countCategorias(usuarioId) {
    return new Promise((resolve, reject) => {  
        Articulo.findAll({
         raw: true,
         nest: true,                                                                        
         attributes: [[Sequelize.fn('count', Sequelize.col('categoriaId')), 'y'],'categoriaId'],
         
         include: [{ model: Categoria, as: "categoria", attributes:['nombre']}],	    
         
         group: ['categoriaId','categoria.nombre']                    
         })
         .then((articulos) =>
           resolve(articulos)
         )
         .catch((reason) => reject(reason));
     });
  }

  




    
}
export default ArticuloService;
