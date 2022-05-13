import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Recibo } = database;

class ReciboService {
    
    static setAdd(dato){
        return new Promise((resolve,reject) =>{
            Recibo.create(dato)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  


}
export default ReciboService; 
