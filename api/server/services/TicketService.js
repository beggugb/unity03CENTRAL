import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Ticket, Cliente,TicketItem, Usuario } = database;

class TicketService {

  //Informe Tickets
  static getTicketsRango(desde,hasta){
    return new Promise((resolve,reject) =>{        
      Ticket.findAndCountAll({
          raw:true,
          nest:true,          
          where: {[Op.and]: [
            { fechaRegistro: { [Op.between]: [desde, hasta]}},            
           ]},
          attributes:["id","fechaRegistro","fechaCierre","codigo","tipo","detalle","estado","clients"],          
        })
        .then((rows) => resolve({                    
          total: rows.count,
          data: rows.rows          
        }))
        .catch((reason)  => reject({ message: reason.message }))  
    })
  }


  static getTotals(gestion){
    return new Promise((resolve,reject) =>{            
      Ticket.findOne({
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

    static getItem(pky){
        return new Promise((resolve,reject) =>{
            Ticket.findByPk(pky,{
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
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Ticket.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
    static setAdd(value){
        return new Promise((resolve,reject) =>{
            Ticket.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } 

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            Ticket.findAndCountAll({
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
          Ticket.destroy({ where: { id: Number(datoId) } })
            .then((rows) => resolve({ message: 'eliminado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        });
    }

   
    static getList(prop,value){
        return new Promise((resolve,reject) =>{
            Ticket.findAll({
              raw: true,
              nest: true,                
              order: [[prop,value]],
              attributes:[[prop,'label'],['id','value']]  
              })
            .then((row) => resolve(row))
            .catch((reason) => reject({ message: reason.message }))
        })
    }

    static search(prop,value){
      return new Promise((resolve,reject) =>{            
          let iValue = '%' + value + '%'
          if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
          Ticket.findAndCountAll({
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

    static getItems(pag,clienteId){                
          return new Promise((resolve,reject) =>{
            let page = parseInt(pag);
            let der = 15 * page - 15;
              Ticket.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: 15,
                order: [['id','asc']],
                where: { clienteId: clienteId},     
                attributes:["id","fechaRegistro","fechaRegistro","tipo","detalle","estado"]         
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
    
}
export default TicketService;
