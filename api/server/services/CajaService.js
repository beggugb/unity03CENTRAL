import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Caja, Usuario } = database;

class CajaService {
  
  static getData(pag,num,usuarioId,rolId){
    return new Promise((resolve,reject) =>{            
      let page = parseInt(pag);
      let der = num * page - num;
        Caja.findAndCountAll({
          raw: true,
          nest: true,
          offset: der,
          limit: num,
          order: [['id','DESC']],                             
          where: {[Op.and]: [            
            { usuarioId: { [Op.eq]: usuarioId }}
           ]},
          include: [
            { model: Usuario,as: "usuario", attributes: ["id", "nombres"]}
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
    
    static setAdd(dato){
        return new Promise((resolve,reject) =>{
            Caja.create(dato)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }  
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            Caja.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    static getItem(pky){
      return new Promise((resolve,reject) =>{
          Caja.findByPk(pky,{
            raw: true,
            nest: true,
            include: [
              { model: Usuario,as: "usuario", attributes: ["id", "nombres"]}
            ] 
          })
          .then((row)=> resolve( row ))
          .catch((reason) => reject({ message: reason.message }))
      })
    }

    static getItemUsuario(usuarioId){
        return new Promise((resolve,reject) =>{
            let d     = new Date()
            let fcaja = (new Date(d + 'UTC')).toISOString().replace(/-/g, '-').split('T')[0] 
            console.log(fcaja)
            Caja.findOne({
              raw: true,
              nest: true,              
              where :  {
                [Op.and]: [
                    { estado : false },
                    { fechaCaja : fcaja },
                    { usuarioId : Number(usuarioId) }
                ] 
              },
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
  
  static getDetalle(desde,hasta,usuarioId){
    return new Promise((resolve,reject) =>{    
      let usuId = (usuarioId === '' || usuarioId === undefined || usuarioId === '' || usuarioId === 0) ? 0: usuarioId         
      Caja.findAndCountAll({
          raw:true,
          nest:true,          
          where: {[Op.and]: [
            { fechaCaja: { [Op.between]: [desde, hasta]}},
            /*{ estado: true},*/
            { usuarioId: { [usuId === 0 ? Op.gt:Op.eq]: usuId}},
           ]},
          /*attributes:["id","fechaCompra","tipo","total","observaciones","estado"],*/      
          attributes:["id","estado","montoInicial","montoEgreso","montoIngreso","montoFinal","fechaCierre","fechaCaja","usuarioId"],  
          include:[
            {model:Usuario,as:"usuario",attributes:["id","nombres"]}  
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
export default CajaService; 
