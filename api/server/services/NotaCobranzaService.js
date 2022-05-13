import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { NotaCobranza } = database;

class NotaCobranzaService {

    static delete(id){
        return new Promise((resolve,reject) =>{
          NotaCobranza.destroy({ where: { id: Number(id) } })
          .then((cliente) => resolve(cliente))
          .catch((reason)  => reject(reason));
        })
    }

    static setNota(dato){
        return new Promise((resolve,reject) =>{
           NotaCobranza.create(dato)
            .then((nota) => resolve( nota.id ))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    } 
    static getItem(prop,pky,saldo){
        return new Promise((resolve,reject) =>{
            const nSaldo = saldo ? 0 : -1
            NotaCobranza.findOne({
              raw: true,
              nest: true,              
              where :  {
                [Op.and]: [
                    { [prop] :{ [Op.eq]: pky }},
                    { saldoTotal :{ [Op.gt]: nSaldo}}
                ] 
              }              
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    } 
    static getKey(prop,pky){
        return new Promise((resolve,reject) =>{            
            NotaCobranza.findOne({
              raw: true,
              nest: true,              
              where :  {
                [Op.and]: [
                    { [prop] :{ [Op.eq]: pky }}
                ] 
              }
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    } 
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            NotaCobranza.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    static getTotal(){
        return new Promise((resolve,reject) =>{
            NotaCobranza.findOne({
              raw:true,
              nest:true,
              where: {ventaId: {[Op.not]: null }},
              attributes: [  
              [Sequelize.fn('sum',Sequelize.col('pagoTotal')),'pagoTotal'],
              [Sequelize.fn('sum',Sequelize.col('saldoTotal')),'saldoTotal']]
    
            })
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }   
   
    
}
export default NotaCobranzaService;
