import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { TicketItem } = database;

class TicketItemService {

    static setAdd(dato){                
        return new Promise((resolve,reject) =>{
            TicketItem.create(dato)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } 

    static getData(pag,num,prop){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
          TicketItem.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [['id','DESC']],
              where: { ticketId: { [Op.eq]: prop }}
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
    /*static setAdd(dato){                
        return new Promise((resolve,reject) =>{
            CajaItem.create(dato)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } 

    /*static getItems(prop){
        return new Promise((resolve,reject) =>{          
            TicketItem.findAll({
              raw: true,
              nest: true,              
              order: [['id','DESC']],
              attributes:["id","fecha","descripcion"],
              where: { ticketId: { [Op.eq]: prop }}
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))
        })
    }*/

    /*static getData(pag,num,prop){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
          CajaItem.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [['id','DESC']],
              where: { cajaId: { [Op.eq]: prop }}
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
    static setAdd(dato){                
        return new Promise((resolve,reject) =>{
            CajaItem.create(dato)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } */
    
    
    
}
export default TicketItemService;
