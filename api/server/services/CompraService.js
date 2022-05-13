import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Almacen, Compra, Proveedor, NotaCobranza, Usuario } = database;

class CompraService {

  // Data
  static getData(pag,num,tipo){
    return new Promise((resolve,reject) =>{            
      let page = parseInt(pag);
      let der = num * page - num;
        Compra.findAndCountAll({
          raw: true,
          nest: true,
          offset: der,
          limit: num,
          order: [['id','desc']],
          attributes:["id","fechaCompra","tipo","origen","totalGeneral","observaciones","estado","nroItems"],              
          where: { tipo: tipo},
          include:[
            {model:Proveedor,as:"proveedor",attributes:["id","razonSocial"]},
            {model:NotaCobranza,as:"notacobranza",attributes:["id","saldoTotal"]}
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

  //Total Cantidad
  static getTotal(gestion){
    return new Promise((resolve,reject) =>{            
      Compra.findOne({
          raw:true,
          nest:true,
          where: { gestion: gestion },
          attributes: [  
          [Sequelize.fn('count',Sequelize.col('id')),'total'],
          [Sequelize.fn('sum',Sequelize.col('totalGeneral')),'suma']]    
        })
        .then((row) => resolve( row ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }

  //Registrar compra Item
  static setAdd(value){
    return new Promise((resolve,reject) =>{
        Compra.create(value)
        .then((row) => resolve( row.id ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  } 

  //Get Item Single
  static getItemSingle(pky){
    return new Promise((resolve,reject) =>{
        Compra.findByPk(pky,{
          raw: true,
          nest: true,   
          attributes:["id","nro","fechaCompra","tipo","nroItems","totalGeneral","subTotal","impuesto","observaciones","estado","proveedorId","usuarioId","proveedors","nroPagos","fechaAprobacion","gestion","mes"]          
        })
        .then((row)=> resolve( row ))
        .catch((reason) => reject({ message: reason.message }))
    })
  }
  //Get Item Compuesto
  static getItem(pky){
    return new Promise((resolve,reject) =>{
        Compra.findByPk(pky,{
          raw: true,
          nest: true,
          include:[
            {model:Proveedor,as:"proveedor",attributes:["id","razonSocial","codigo","email"]},
            {model:Usuario,as:"usuario",attributes:["id","nombres"]},
            {model:Almacen,as:"almacen",attributes:["id","nombre"]} 
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
    Compra.findAndCountAll({
        raw: true,
        nest: true,
        offset: 0,
        limit: 15,        
        where: {[Op.and]: [            
          { tipo: tipo },
          { observaciones: { [Op.iLike]: iValue }}
         ]},
        order: [['id','DESC']],
        attributes:["id","fechaCompra","tipo","totalGeneral","observaciones","estado"],              
        include:[
          {model:Proveedor,
              as:"proveedor",
              attributes:["id","razonSocial"],
              where: { razonSocial: { [Op.iLike]: pValue }},

          },
          {model:NotaCobranza,as:"notacobranza",attributes:["id","saldoTotal"]}
        ]  
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

 

  static getDetalleLista(gestion){
    return new Promise((resolve,reject) =>{
      Compra.findAll({
          raw:true,
          nest:true,          
          where: { gestion: gestion },
          attributes: ['mes',[Sequelize.fn('count',Sequelize.col('id')),'total']],
          group: ['mes']  
        })
        .then((row) => resolve(row))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }

 
  

    static delete(id){
      return new Promise((resolve,reject) =>{
        Compra.destroy({ where: { id: Number(id) } })
        .then((cliente) => resolve(cliente))
        .catch((reason)  => reject(reason));
      })
    }
    
    
    static setUpdate(value,id){
      return new Promise((resolve,reject) =>{
          Compra.update(value, { where: { id: Number(id) } })
          .then((row)=> resolve( row ))
          .catch((reason) => reject({ message: reason.message })) 
      })
  }

 

  static getDetalleMes(desde,hasta){
    return new Promise((resolve,reject) =>{
      Compra.findAll({
          raw:true,
          nest:true,          
          where: {[Op.and]: [
            { fechaCompra: { [Op.between]: [desde, hasta]}},
            { estado: "cerrado"}
           ]},
           attributes: ['mes',[Sequelize.fn('count',Sequelize.col('id')),'total']],
           group: ['mes']  
        })
        .then((row) => resolve(row))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }

  static getDetalle(desde,hasta,estado,rango,vrango){
    return new Promise((resolve,reject) =>{
      let iSaldo = 0
      let fSaldo = 1000000
      switch(estado){
        case "pagado":
          iSaldo = 0
          fSaldo = 0
          break;
        case "saldo":
          iSaldo = 1
          fSaldo = 1000000  
          break;
        default:
          break;
      }
      Compra.findAndCountAll({
          raw:true,
          nest:true,          
          where: {[Op.and]: [
            { fechaCompra: { [Op.between]: [desde, hasta]}},
            { estado: "cerrado"},
            { total: { [rango === 'menor' ? Op.lte:Op.gte]: vrango}},
           ]},
          attributes:["id","fechaCompra","tipo","totalGeneral","observaciones","estado"],
          include:[
            {model:Proveedor,as:"proveedor",attributes:["id","razonSocial"]},
            {
              model:NotaCobranza,as:"notacobranza",
              attributes:["id","saldoTotal"],
              where: {saldoTotal : { [Op.between]: [iSaldo, fSaldo]}}
            }
          ]
        })
        .then((rows) => resolve({                    
          total: rows.count,
          data: rows.rows          
        }))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }

  /*static getTotalMovimientos(desde,hasta,estado){    
    return new Promise((resolve,reject) =>{ 
      let iSaldo = 0
      let fSaldo = 1000000
      switch(estado){
        case "pagado":
          iSaldo = 0
          fSaldo = 0
          break;
        case "saldo":
          iSaldo = 1
          fSaldo = 1000000  
          break;
        default:
          break;
      }

      Compra.findOne({
          raw:true,
          nest:true,
          attributes: [           
          [Sequelize.fn('sum',Sequelize.col('total')),'suma']],
          where: {[Op.and]: [
            { fechaCompra: { [Op.between]: [desde, hasta]}},
            { estado: "cerrado"}
           ]}, 
           include:[            
            {
              model:NotaCobranza,as:"notacobranza",
              attributes:["id","saldoTotal"],
              where: {saldoTotal : { [Op.between]: [iSaldo, fSaldo]}}
            }
          ]   
        })
        .then((row) => resolve( row ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }*/
  //Informe Compra
  static getComprasRango(desde,hasta,estado){
    return new Promise((resolve,reject) =>{  
      let iSaldo = 0
      let fSaldo = 1000000
      switch(estado){
        case "pagado":
          iSaldo = 0
          fSaldo = 0
          break;
        case "pendiente":
          iSaldo = 1
          fSaldo = 1000000  
          break;
        default:
          break;
      }    
      Compra.findAndCountAll({
          raw:true,
          nest:true,          
          where: {[Op.and]: [
            { fechaCompra: { [Op.between]: [desde, hasta]}},
            { estado: "cerrado"}            
           ]},
          attributes:["id","fechaCompra","tipo","totalGeneral","observaciones","estado"],
          include:[
            {model:Proveedor,as:"proveedor",attributes:["id","razonSocial"]},
            {
              model:NotaCobranza,as:"notacobranza",
              attributes:["id","saldoTotal","pagoTotal"],
              where: {saldoTotal : { [Op.between]: [iSaldo, fSaldo]}}            
            }
          ]
        })
        .then((rows) => resolve({                    
          total: rows.count,
          data: rows.rows          
        }))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }




    
}
export default CompraService;
