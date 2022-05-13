import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { CuentaCorriente } = database;

class CuentaCorrienteService{

    static setAdd(value){
        return new Promise((resolve,reject) =>{
            CuentaCorriente.create(value)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }

    static verificar(clienteId) {      
        return new Promise((resolve, reject) => {        
            CuentaCorriente.findOne({
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
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            CuentaCorriente.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }

}
export default CuentaCorrienteService; 
