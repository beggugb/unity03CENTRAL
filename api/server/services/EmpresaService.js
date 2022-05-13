import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Empresa } = database;

class EmpresaService {

    static getItem(pky){
        return new Promise((resolve,reject) =>{
            Empresa.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    } 
    static getSingle(pky){
        return new Promise((resolve,reject) =>{
            Empresa.findByPk(pky,{
              raw: true,
              nest: true,
              attributes:['id','nombre','pais','moneda','labelMoneda','direccion','smtpHost','smtpUser','smtpPassword','smtpSecure','smtpPort','email','politicaCotizacion','garantiaCotizacion','labelCotizacion']
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    } 
    static getSingles(pky){
        return new Promise((resolve,reject) =>{
            Empresa.findByPk(pky,{
              raw: true,
              nest: true,
              attributes:['id','nombre','pais','moneda','labelMoneda','licencia','fechaLicencia']
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Empresa.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    
}
export default EmpresaService;
