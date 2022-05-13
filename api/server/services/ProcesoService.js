import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Proceso, Comprobante } = database;

class ProcesoService {

    static getData(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          console.log(pag)
          console.log(num)
          console.log(prop)
          console.log(value)
          let page = parseInt(pag);
          let der = num * page - num;
            Proceso.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [['id','desc']],
              attributes:["id","estado","usuarioId","nombre"],              
              include:[                
                {
                    model:Comprobante,
                    as:"comprobante",
                    attributes:["id","montoTotal","glosaComprobante","tipoComprobante","fechaComprobante","numComprobante"],                             
                },
              ],
              where :  {
                [Op.and]: [
                    { estado :{ [Op.eq]: prop }},
                    { usuarioId  :{ [Op.eq]: value }}
                ] 
              }
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

    static getItem(pky){
        return new Promise((resolve,reject) =>{
            Proceso.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    static getPky(pky){
        return new Promise((resolve,reject) =>{
            Proceso.findOne({
              raw: true,
              nest: true,
              where : { comprobanteId: {[Op.eq]: pky }}
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
  
    static getList(usuarioId){
        return new Promise((resolve,reject) =>{
            Proceso.findAll({
              raw: true,
              nest: true,                
              order: [['id','ASC']],              
              })
            .then((row) => resolve(row))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    
    static setAdd(dato){
        return new Promise((resolve,reject) =>{
            Proceso.create(dato)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Proceso.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }


}
export default ProcesoService; 
