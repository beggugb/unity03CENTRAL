import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Almacen, AlmacenItem, Articulo, Marca, Categoria, Unidad   } = database;

class AlmacenItemsService {

  static searchSingle(prop,value,almacenId){
    return new Promise((resolve,reject) =>{  
      console.log(prop)
      console.log(value)
      console.log(almacenId)
       AlmacenItem.findAll({
        raw: true,
        nest: true,           
        limit:15,        
        where: {[Op.and]: [
          { almacenId: almacenId },             
          { stock: { [Op.gt]: 0}},     
        ]},   
          include: [{ 
            model: Articulo, as: "articulo",            
            where: {[prop]: { [Op.iLike]: '%'+value+'%' }},
            attributes:['id','precioOferta','inOferta','codigo','descripcion','codigoBarras','nombreCorto','nombre','precioVenta','filename','categoriaId'],            
            include:[{ model: Unidad, as: "unidad" }  
            ]},
          ]  
  
       })
        .then((rows)=> resolve(rows ))
        .catch((reason) => reject({ message: reason.message }))      
    })
  }

  static getRotacionArticulo(){
    return new Promise((resolve,reject) =>{      
      AlmacenItem.findAll({
          raw: true,
          nest: true,          
          limit: 5,  
          attributes: ['stock'],                      
          include:[{ model:Articulo,as:"articulo",attributes:["nombre","smi"]}],               
          order: [['stock','asc']]  
        })
        .then((rows) => resolve(rows))
        .catch((reason) => reject({ message: reason.message }))
    })
  }

  static sumArticulo() {
    return new Promise((resolve, reject) => {  
      AlmacenItem.findOne({
         raw: true,
         nest: true,                                                                                 
          attributes: [[Sequelize.fn('sum', Sequelize.col('stock')), 'total']]          
         })
         .then((articulos) =>
           resolve(articulos)
         )
         .catch((reason) => reject(reason));
     });
  }
  static countArticulo() {
    return new Promise((resolve, reject) => {  
      AlmacenItem.findAll({
         raw: true,
         nest: true,   
         limit : 10,                                                                              
         attributes: [[Sequelize.fn('sum', Sequelize.col('stock')), 'y'],'articuloId'],         
         include: [{ model: Articulo, as: "articulo", attributes:['nombre']}],	             
         group: ['articuloId','articulo.nombre']                            
         })
         .then((articulos) =>
           resolve(articulos)
         )
         .catch((reason) => reject(reason));
     });
  }

  static sumArticulos() {
    return new Promise((resolve, reject) => {  
      AlmacenItem.findOne({
         raw: true,
         nest: true,                                                                                 
          attributes: [[Sequelize.fn('sum', Sequelize.col('valor')), 'total']]          
         })
         .then((articulos) =>
           resolve(articulos)
         )
         .catch((reason) => reject(reason));
     });
  }
  static countArticulos() {
    return new Promise((resolve, reject) => {  
      AlmacenItem.findAll({
         raw: true,
         nest: true,   
         limit : 10,                                                                              
         attributes: [[Sequelize.fn('sum', Sequelize.col('valor')), 'y'],'articuloId'],         
         include: [{ model: Articulo, as: "articulo", attributes:['nombre']}],	             
         group: ['articuloId','articulo.nombre','valor'],                    
         order: [['valor','desc']]
         })
         .then((articulos) =>
           resolve(articulos)
         )
         .catch((reason) => reject(reason));
     });
  }


  static getInformeData(){
    return new Promise((resolve,reject) =>{      
      AlmacenItem.findAll({
          raw: true,
          nest: true,          
          limit: 10,              
          attributes: [[Sequelize.fn('sum',Sequelize.col('stock')),'suma'],"articuloId"],
          include:[{ model:Articulo,as:"articulo",attributes:["nombre"]}],               
          group: ['articuloId','nombre']  
        })
        .then((rows) => resolve(rows))
        .catch((reason) => reject({ message: reason.message }))
    })
  }

  static getStockItems(articuloId){
    return new Promise((resolve,reject) =>{      
      AlmacenItem.findAll({
          raw: true,
          nest: true,   
          attributes: ["almacenId","stock"],
          include:[{ model:Almacen,as:"almacen",attributes:["id","ubicacion","nombre"]}],
          where: {[Op.and]: [
            { articuloId: articuloId },             
            { stock: { [Op.gt]: 0}}, 
            { almacenId: { [Op.lt]: 100}} 
          ]},
        })
        .then((rows) => resolve(rows))
        .catch((reason) => reject({ message: reason.message }))
    })
  }


  static getData(pag,num,name,codigo,almacenId,categoriaId,value){
    return new Promise((resolve,reject) =>{  
      let page = parseInt(pag);
      let der = num * page - num;  
      let iStock     = 0;
      let fStock     = 5000;
      
      let iCategoria = categoriaId
      let fCategoria = categoriaId

      let iValue  = '%' + name + '%'
      let iCodigo = '%' + codigo + '%'
      
      if(name === '--todos--' || name === null || name === '0') { iValue = '%' }            
      if(codigo === '--todos--' || codigo === null || codigo === 0 || codigo === '0') { iCodigo = '%' }   
      if(value === 0) { iStock = 0, fStock = 0 }
      if(value === 1) { iStock = 1, fStock = 5000 }     
      if(categoriaId === 0 || categoriaId === '0' || categoriaId === 'undefined' ) 
      { iCategoria = 0, fCategoria = 5000 }     


       AlmacenItem.findAndCountAll({
        raw: true,
        nest: true,           
        offset: der,
        limit: num,   
        where: {[Op.and]: [
          { almacenId: almacenId },             
          { stock: { [Op.between]: [iStock, fStock]}},     
        ]},   
          include: [{ 
            model: Articulo, as: "articulo",            
            where: {[Op.and]: [
              {categoriaId: {[Op.between]: [iCategoria,fCategoria]}},
              {nombre: { [Op.iLike]: iValue}},
              {codigo: { [Op.iLike]: iCodigo}}
            ]},
            attributes:['id','precioOferta','inOferta','codigo','codigoBarras','nombreCorto','nombre','precioVenta','filename','categoriaId'],
            include:[
              {model:Marca,as:"marca",attributes:["id","nombre"]}
            ]
            }]  
  
       })
        .then((rows)=> resolve({
          paginas: Math.ceil(rows.count / num),
          pagina: page,
          total: rows.count,
          data: rows.rows
        } ))
        .catch((reason) => reject({ message: reason.message }))      
    })
  }

 
    
  static setAdd(dato){
        return new Promise((resolve,reject) =>{
            AlmacenItem.create(dato)
            .then((iitem) => resolve( iitem ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
  
    static setUpdate(dato, datoId) {
        return new Promise((resolve, reject) => {
            AlmacenItem.update(dato, { where: { id: Number(datoId) } })
            .then((cliente) => resolve(cliente))
            .catch((reason) => reject(reason));
        });
    }

    static verificar(articuloId,almacenId) {      
        return new Promise((resolve, reject) => {        
          AlmacenItem.findOne({
            raw: true,
            nest: true,                        
            where :  {
                [Op.and]: [
                  { almacenId: {[Op.eq]: almacenId }},
                  { articuloId: {[Op.eq]: articuloId }},
                ] 
              },
              attributes:["id","almacenId","articuloId","stock","valor","costo"],   
          })           
            .then((result) => {                              
                resolve(result)
            })
            .catch((reason) => {                
                reject({ message: reason.message })
              });             
        });
    }

    static getDetalle(almacenId,articuloId,categoriaId,value,rango,vrango){
      return new Promise((resolve,reject) =>{  

     
        
        let iStock     = 0;
        let fStock     = 5000;
        if(value === 0) { iStock = 0, fStock = 0 }
        if(value === 1) { iStock = 1, fStock = 5000 }     

        let art = articuloId === 0 || articuloId === '' || articuloId === undefined ? 0:articuloId 
        let cat = categoriaId === 0 || categoriaId === '' || categoriaId === undefined ? 0:categoriaId 
        let alm = almacenId === 0 || almacenId === '' || almacenId === undefined ? 0:almacenId

        
        AlmacenItem.findAndCountAll({
          raw: true,
          nest: true,                     
          where: {[Op.and]: [            
            { almacenId: {[alm === 0 ? Op.gt: Op.eq]: alm}},            
            { stock: { [Op.between]: [iStock, fStock]}},     
            { articuloId: {[art === 0 ? Op.gt: Op.eq]: art }}
          ]},   
            include: [{ 
              model: Articulo, as: "articulo",            
              where: {[Op.and]: [                
                { categoriaId: {[cat === 0 ? Op.gt: Op.eq]: cat}},                                
                { precioVenta: { [rango === 'menor' ? Op.lte:Op.gte]: vrango}},
              ]},
              attributes:['id','codigo','codigoBarras','nombreCorto','nombre','precioVenta','filename','categoriaId'],
              include:[
                {model:Marca,as:"marca",attributes:["id","nombre"]},
                {model:Categoria,as:"categoria",attributes:["id","nombre"]}
              ]
              },
              {model:Almacen,as:"almacen",attributes:["id","nombre"]},
            ]  
    
         })
          .then((rows)=> resolve({            
            total: rows.count,
            data: rows.rows
          } ))
          .catch((reason) => reject({ message: reason.message }))      
      })
    }


    

   
   
    
}
export default AlmacenItemsService;
