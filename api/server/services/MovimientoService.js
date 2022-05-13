import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Movimiento, Compra, Usuario } = database;

class MovimientoService {

  static getData(pag,num,tipo){
    return new Promise((resolve,reject) =>{            
      let page = parseInt(pag);
      let der = num * page - num;
        Movimiento.findAndCountAll({
          raw: true,
          nest: true,
          offset: der,
          limit: num,
          order: [['id','desc']],
          attributes:["id","origen","motivo","estado","totalGeneral","destino","tipo","fecha","nroItems","gestion","mes"],            
          /*where: { tipo: tipo},          */
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

 
  //Registrar movimiento Item
  static setAdd(value){
    return new Promise((resolve,reject) =>{
        Movimiento.create(value)
        .then((row) => resolve( row.id ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  } 

  //Get Item Single
  static getItemSingle(pky){
    return new Promise((resolve,reject) =>{
        Movimiento.findByPk(pky,{
          raw: true,
          nest: true,   
          /*attributes:["id","nro","fechaMovimiento","tipo","nroItems","totalGeneral","subTotal","impuesto","observaciones","estado","proveedorId","usuarioId","proveedors","nroPagos","fechaAprobacion","gestion","mes"]      */
          attributes:["id","origenId","destinoId","origen","motivo","totalGeneral","nroItems","destino","tipo","fecha","nroItems","gestion","mes"],
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }
  //Get Item Compuesto
  static getItem(pky){
    return new Promise((resolve,reject) =>{
        Movimiento.findByPk(pky,{
          raw: true,
          nest: true,
          include:[            
            {model:Usuario,as:"usuario",attributes:["id","nombres"]}
        ]  
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }



  

static search(prop,value,usuarioId,rolId,tipo){
  return new Promise((resolve,reject) =>{
    let iValue = ''
    let pValue = ''
    let iok = (rolId === 1 || rolId === '1') ? 0: usuarioId

    if(prop === 'observaciones'){
      iValue = (value === '--todos--' || value === null || value === '0') ? iValue = '%' : '%' + value + '%' 
      pValue = '%'
    }else{
      pValue = (value === '--todos--' || value === null || value === '0') ? pValue = '%' : '%' + value + '%' 
      iValue = '%'
    }
    Movimiento.findAndCountAll({
        raw: true,
        nest: true,
        offset: 0,
        limit: 15,        
        where: {[Op.and]: [            
          { tipo: tipo },
          { observaciones: { [Op.iLike]: iValue }}
         ]},
        order: [['id','DESC']],
        attributes:["id","origen","destino","tipo","fecha","nroItems","gestion","mes"],
      })
      .then((rows) => resolve({
        paginas: Math.ceil(rows.count / 12),
        pagina: 1,
        total: rows.count,
        data: rows.rows
      }))
      .catch((reason) => reject({ message: reason.message }))
  })
}

 
 

    static delete(id){
      return new Promise((resolve,reject) =>{
        Movimiento.destroy({ where: { id: Number(id) } })
        .then((cliente) => resolve(cliente))
        .catch((reason)  => reject(reason));
      })
    }
    
    
    static setUpdate(value,id){
      return new Promise((resolve,reject) =>{
          Movimiento.update(value, { where: { id: Number(id) } })
          .then((row)=> resolve( row ))
          .catch((reason) => reject({ message: reason.message })) 
      })
  }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Movimiento.create(value)
            .then((row) => resolve( row.id ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  
    static getListaDetalle(gestion,tipo){
      return new Promise((resolve,reject) =>{      
        Movimiento.findAll({
            raw:true,
            nest:true,                      
            where: {[Op.and]: [
              { gestion: gestion },              
              { tipo:  tipo }          
             ]},
            attributes: [[Sequelize.fn('count',Sequelize.col('id')),'total'],'mes','tipo'],
            group:['mes','tipo']
          })
          .then((rows) => resolve(rows))
          .catch((reason)  => reject({ message: reason.message }))  
      })
  }
    static getDetalle(desde,hasta,tipo){
        return new Promise((resolve,reject) =>{      
          let iValue  = tipo + '%'   

          if(tipo === '--todos--' || tipo === null || tipo === '0' || tipo === 0) { iValue = '%' } 
          Movimiento.findAndCountAll({
              raw:true,
              nest:true,          
              where: {[Op.and]: [
                { fecha: { [Op.between]: [desde, hasta]}},
                /*{ tipo: tipo},*/
                {tipo: { [Op.iLike]: iValue}},          
               ]}, 
               attributes:["id","origen","motivo","totalGeneral","destino","tipo","nroItems","fecha","compraId","ventaId","almacenId"],
             /*  include:[
                {model:Compra,as:"compra",attributes:["id","observaciones","totalGeneral"]}]*/
            })
            .then((rows) => resolve({                    
              total: rows.count,
              data: rows.rows          
            }))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }    
    
}
export default MovimientoService;
