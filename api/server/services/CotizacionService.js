import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Cotizacion, Cliente, Usuario, NotaCobranza } = database;

class CotizacionService {

  //Informe Cotizaciones
  static getCotizacionRango(desde,hasta){
    return new Promise((resolve,reject) =>{        
      Cotizacion.findAndCountAll({
          raw:true,
          nest:true,          
          where: {[Op.and]: [
            { fechaCotizacion: { [Op.between]: [desde, hasta]}},            
           ]},
          attributes:["id","fechaCotizacion","nroItems","totalGeneral","observaciones","clients"]
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
      Cotizacion.findOne({
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

  static getItems(pag,clienteId){                
    return new Promise((resolve,reject) =>{
      let page = parseInt(pag);
      let der = 15 * page - 15;
      Cotizacion.findAndCountAll({
          raw: true,
          nest: true,
          offset: der,
          limit: 15,
          order: [['id','desc']],
          where: { clienteId: clienteId},     
          attributes:["id","fechaCotizacion","observaciones","estado","total"]         
        })
        .then((rows) => resolve({
          paginas: Math.ceil(rows.count / 15),
          pagina: page,
          total: rows.count,
          data: rows.rows
        }))
        .catch((reason) => reject({ message: reason.message }))
    })        
}

  static getTotal(usuarioId,rolId){
    return new Promise((resolve,reject) =>{
      let iok = (rolId === 1 || rolId === '1') ? 0: usuarioId 
      Cotizacion.findOne({
          raw:true,
          nest:true,
        /*  where: {[Op.and]: [            
            { usuarioId: { [(rolId === 1 || rolId === '1') ? Op.gt:Op.eq]: iok }},
           ]},*/
          attributes: [
          [Sequelize.fn('count',Sequelize.col('id')),'total'],
          [Sequelize.fn('sum',Sequelize.col('totalGeneral')),'suma']]                  
        })
        .then((row) => resolve( row ))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }

  static delete(id){
    return new Promise((resolve,reject) =>{
      Cotizacion.destroy({ where: { id: Number(id) } })
      .then((cliente) => resolve(cliente))
      .catch((reason)  => reject(reason));
    })
  }

  static search(value,cliente,fecha){
    return new Promise((resolve,reject) =>{            
        let iValue   = '%' + value + '%'
        let iCliente = '%' + cliente + '%'

        if (value === '--todos--' || value === null || value === '0') { iValue = '%' }
        if (cliente === '--todos--' || cliente === null || cliente === '0') { iCliente = '%' }            

        Cotizacion.findAndCountAll({
            raw: true,
            nest: true,
            offset: 0,
            limit: 12,
            where: {[Op.and]:[
                {fechaCotizacion: { [ fecha === '2020-01-01' ?Op.gt :Op.eq ]: fecha }},
                {observaciones: { [Op.iLike]: iValue }}
              ]},
              order: [['id','desc']],
            attributes:["id","fechaCotizacion","totalGeneral","observaciones","estado"],
            include:[
              { model:Cliente,
                as:"cliente",
                attributes:["id","nombres","email"],
                where: { nombres: { [Op.iLike]: iCliente }},
              },
                          
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
    
    static setAdd(dato){
        return new Promise((resolve,reject) =>{
            Cotizacion.create(dato)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Cotizacion.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    static getItem(pky){
        return new Promise((resolve,reject) =>{
            Cotizacion.findByPk(pky,{
              raw: true,
              nest: true,
              include:[
                {model:Cliente,as:"cliente",attributes:["id","nombres","email"]},
                {model:Usuario,as:"usuario",attributes:["id","nombres"]}
              ]  
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    } 
    static getData(pag,num,usuarioId,rolId){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Cotizacion.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [['id','desc']],
              attributes:["id","fechaCotizacion","totalGeneral","observaciones","estado"],              
              include:[
                {model:Cliente,as:"cliente",attributes:["id","nombres","email"]}                
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
    static dataUsuario(pag,num,prop,value){
     
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Cotizacion.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,              
              where :  { usuarioId: prop },
              order: [['id','desc']],
              attributes:["id","fechaCotizacion","totalGeneral","observaciones","estado","estf","usuarioId"],              
              include:[
                  {model:Cliente,as:"cliente",attributes:["id","nombres"]},
                  {model:Usuario,as:"usuario",attributes:["id","nombres"]}
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
    static dataCajero(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Cotizacion.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,              
              where :  { isServicio : false },
              order: [['id','desc']],
              attributes:["id","fechaCotizacion","totalGeneral","observaciones","estado","estf","usuarioId"],              
              include:[
                  {model:Cliente,as:"cliente",attributes:["id","nombres"]},
                  {model:Usuario,as:"usuario",attributes:["id","nombres"]}
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
   /* static getTotal(){
      return new Promise((resolve,reject) =>{
        Cotizacion.findOne({
            raw:true,
            nest:true,
            attributes: [
            [Sequelize.fn('count',Sequelize.col('id')),'total'],
            [Sequelize.fn('sum',Sequelize.col('total')),'suma']
          ]                  
  
          })
          .then((row) => resolve( row ))
          .catch((reason)  => reject({ message: reason.message }))  
      })
    }*/

    static getDetalleMes(desde,hasta){
      return new Promise((resolve,reject) =>{
        Cotizacion.findAll({
            raw:true,
            nest:true,          
            where: {[Op.and]: [
              { fechaCotizacion: { [Op.between]: [desde, hasta]}},
              { estado: "cerrado"}
             ]},
             attributes: ['mes',[Sequelize.fn('count',Sequelize.col('id')),'total']],
             group: ['mes']  
          })
          .then((row) => resolve(row))
          .catch((reason)  => reject({ message: reason.message }))  
      })
    }

    static getMovimientos(desde,hasta,estado){
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
        Cotizacion.findOne({
            raw:true,
            nest:true,
            attributes: ["id",  
            [Sequelize.fn('count',Sequelize.col('id')),'totalGeneral'],
            [Sequelize.fn('sum',Sequelize.col('totalGeneral')),'suma']],
            where: {[Op.and]: [
              { fechaCotizacion: { [Op.between]: [desde, hasta]}},
              { estado: "cerrado"}
             ]},  
            include:[{
              model:NotaCobranza,as:"notacobranza",
              attributes:["id","saldoTotal"],
              where: {saldoTotal : { [Op.between]: [iSaldo, fSaldo]}}
            }],
            group: ['id']  
          })
          .then((row) => resolve( row ))
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
        Cotizacion.findAndCountAll({
            raw:true,
            nest:true,          
            where: {[Op.and]: [
              { fechaCotizacion: { [Op.between]: [desde, hasta]}},
              { estado: "cerrado"},
              { total: { [rango === 'menor' ? Op.lte:Op.gte]: vrango}},
             ]},
            attributes:["id","fechaCotizacion","tipo","totalGeneral","observaciones","estado"],
            include:[
              {model:Cliente,as:"cliente",attributes:["id","nombres"]},              
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


}
export default CotizacionService; 
