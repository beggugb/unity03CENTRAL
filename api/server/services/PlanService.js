import database from "../../src/models";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { PlanPagos, NotaCobranza, Venta, Compra, Cliente, Proveedor } = database;

class PlanService {

  static getInformeData(tipo,estado){
    return new Promise((resolve,reject) =>{      
      PlanPagos.findAll({
          raw: true,
          nest: true,          
          limit: 10,
          order: [['mes','asc']],
          where: {[Op.and]: [
            { isVenta:  tipo }, 
            { estado : estado }                               
          ]},
          attributes: [[Sequelize.fn('sum',Sequelize.col('monto')),'total'],'mes'],                                      
          group: ['mes']  
        })
        .then((rows) => resolve(rows))
        .catch((reason) => reject({ message: reason.message }))
    })
  }

 

    static delete(id){
        return new Promise((resolve,reject) =>{
            PlanPagos.destroy({ where: { notaId: Number(id) } })
          .then((cliente) => resolve(cliente))
          .catch((reason)  => reject(reason));
        })
    }

    static setAddSingle(dato){
        return new Promise((resolve,reject) =>{
            PlanPagos.create(dato)
            .then((row) => resolve( row ))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    } 

    static setAdd(data){
        return new Promise((resolve,reject) =>{
            PlanPagos.bulkCreate(data,{
             individualHooks: true})
            .then((rows) => resolve({ message: 'registrado' }))
            .catch((reason)  => reject({ message: reason.message }))      
        })
    }
    static setAddI(value){
      return new Promise((resolve,reject) =>{
        PlanPagos.create(value)
          .then((row) => resolve(row.id))
          .catch((reason)  => reject({ message: reason.message }))  
      })
  }
    static getItem(pky){
        return new Promise((resolve,reject) =>{
            PlanPagos.findByPk(pky,{
              raw: true,
              nest: true
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }   
    static getKey(pky,cuota){
        return new Promise((resolve,reject) =>{            
            PlanPagos.findOne({
              raw: true,
              nest: true,              
              where :  {
                [Op.and]: [
                    { notaId :{ [Op.eq]: pky }},
                    { cuota  :{ [Op.eq]: cuota }}
                ] 
              }
            })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message }))
        })
    }  
    static setUpdate(value,id){
        return new Promise((resolve,reject) =>{
            PlanPagos.update(value, { where: { id: Number(id) } })
            .then((row)=> resolve( row ))
            .catch((reason) => reject({ message: reason.message })) 
        })
    }
    static getItems(nota){
        return new Promise((resolve,reject) =>{          
            PlanPagos.findAll({
              raw: true,
              nest: true,              
              order: [['cuota','ASC']],
              where: { notaId: nota}                
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))
        })
    }
    static getCobros(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            PlanPagos.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [[prop,value],'cuota'],
              attributes:["id","cuota","monto","fechaPago","estado"],              
              include:[                
                {
                    model:NotaCobranza,
                    as:"nota",
                    attributes:["id","detalle","ventaId"],
                    where: { isVenta:  true }                          
                },
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
    static getPagos(pag,num,prop,value){
        return new Promise((resolve,reject) =>{
          let page = parseInt(pag);
          let der = num * page - num;
            PlanPagos.findAndCountAll({
              raw: true,
              nest: true,
              offset: der,
              limit: num,
              order: [[prop,value]],
              attributes:["id","cuota","monto","fechaPago","fechaPagado","estado"],              
              include:[                
                {
                    model:NotaCobranza,
                    as:"nota",
                    attributes:["id","detalle","compraId"],
                    where: { isVenta:  false }
                    
                },
              ],                
              
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
   
    static getDetallePagos(desde,hasta,estado){
        return new Promise((resolve,reject) =>{                          
          PlanPagos.findAndCountAll({
              raw:true,
              nest:true,
              attributes:["id","cuota","monto","estado","fechaPago","fechaPagado","notaId"],            
              include:[                
                {
                    model:NotaCobranza,
                    as:"nota",
                    attributes:["id"],
                    where: { isVenta:  false },
                    include:[                
                        {
                            model:Compra,
                            as:"compra",
                            attributes:["id","proveedorId"],
                            include:[                
                                {
                                    model:Proveedor,
                                    as:"proveedor",
                                    attributes:["id","razonSocial"],                                    
                                  
                                }
                            ]        

                        }
                    ]        
                },
              ],
              where: {              
                [Op.and]: [
                    {estado: { [Op.eq]: estado}},                                     
                    [estado ? {fechaPagado : { [Op.between]: [desde, hasta]}}:{fechaPago : { [Op.between]: [desde, hasta]}}]
                ]
              }              
            })
            .then((rows) => resolve({                    
              total: rows.count,
              data: rows.rows          
            }))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }
    static getDetalleCobros(desde,hasta,estado){
        return new Promise((resolve,reject) =>{                          
          PlanPagos.findAndCountAll({
              raw:true,
              nest:true,
              attributes:["id","cuota","monto","estado","fechaPago","fechaPagado","notaId"],            
              include:[                
                {
                    model:NotaCobranza,
                    as:"nota",
                    attributes:["id"],
                    where: { isVenta:  true },
                    include:[                
                        {
                            model:Venta,
                            as:"venta",
                            attributes:["id","clienteId"],
                            include:[                
                                {
                                    model:Cliente,
                                    as:"cliente",
                                    attributes:["id","nombres"],                                    
                                  
                                }
                            ]        

                        }
                    ]        
                },
              ],
              where: {              
                [Op.and]: [
                    {estado: { [Op.eq]: estado}},
                    [estado ? {fechaPagado : { [Op.between]: [desde, hasta]}}:{fechaPago : { [Op.between]: [desde, hasta]}}]
                ]
              }              
            })
            .then((rows) => resolve({                    
              total: rows.count,
              data: rows.rows          
            }))
            .catch((reason)  => reject({ message: reason.message }))  
        })
    }
    static searchPagos(pag,num,prop,value){
        return new Promise((resolve,reject) =>{             
          let page = parseInt(pag);
          let der = num * page - num;            
            let iValue = '%' + value + '%'
            if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
            PlanPagos.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,                
                attributes:["id","cuota","monto","fechaPago","estado"],
                
                include:[                
                  {
                      model:NotaCobranza,
                      as:"nota",
                      attributes:["id","detalle","compraId"],
                      where: {[Op.and]: [
                          { detalle :{ [Op.iLike]: iValue }},             
                          { isVenta:  false }     
                        ]},
                      
                  },
                ],          
               
            })		
            .then((rows) => resolve({
                paginas: Math.ceil(rows.count / num),
                pagina: page,
                total: rows.count,
                data: rows.rows
            } 
            ))
        .catch((reason)  => reject({ message: reason.message })) 
         })
       }

       static searchCobros(pag,num,prop,value){
        return new Promise((resolve,reject) =>{             
          let page = parseInt(pag);
          let der = num * page - num;            
            let iValue = '%' + value + '%'
            if (value === '--todos--' || value === null || value === '0') { iValue = '%' }            
            PlanPagos.findAndCountAll({
                raw: true,
                nest: true,
                offset: der,
                limit: num,                
                attributes:["id","cuota","monto","fechaPago","estado"],
                
                include:[                
                  {
                      model:NotaCobranza,
                      as:"nota",
                      attributes:["id","detalle","ventaId"],
                      where: {[Op.and]: [
                          { detalle :{ [Op.iLike]: iValue }},             
                          { isVenta:  true }     
                        ]},
                      
                  },
                ],          
                 
            })		
            .then((rows) => resolve({
                paginas: Math.ceil(rows.count / num),
                pagina: page,
                total: rows.count,
                data: rows.rows
            } 
            ))
        .catch((reason)  => reject({ message: reason.message })) 
         })
    }   
  static getItemsPagos(gestion,estado){
      return new Promise((resolve,reject) =>{
        PlanPagos.findAll({
            raw: true,
            nest: true,  
            where: {              
              [Op.and]: [
                { gestion: gestion},
                { isVenta: false},
                { estado: estado},
              ]
            },
            attributes: [[Sequelize.fn('sum',Sequelize.col('monto')),'total'],'mes'],
            group:['mes']                     
          })
          .then((rows) => resolve(rows))
          .catch((reason) => reject({ message: reason.message }))
      })
    }
  static getItemPagos(gestion,estado){
      return new Promise((resolve,reject) =>{
        PlanPagos.findOne({
            raw: true,
            nest: true,  
            where: {              
              [Op.and]: [
                { gestion: gestion},
                { isVenta: false},
                { estado: estado},
              ]
            },
            attributes: [  
              [Sequelize.fn('count',Sequelize.col('id')),'total'],
              [Sequelize.fn('sum',Sequelize.col('monto')),'suma']]                      
          })
          .then((rows) => resolve(rows))
          .catch((reason) => reject({ message: reason.message }))
      })
    }  

    static getListaPagos(estado,desde,hasta){
      return new Promise((resolve,reject) =>{        
        PlanPagos.findAndCountAll({
            raw: true,
            nest: true,  
            where: {              
              [Op.and]: [                
                { isVenta: false},
                { estado: estado},
                { fechaPago: { [Op.between]: [desde, hasta]}},
              ]
            }, 
            include:[{
                      model:NotaCobranza,
                      as:"nota",
                      attributes:["id","detalle","compraId"],
                      include:[{
                        model:Compra,
                        as:"compra",
                        attributes:["id","proveedors"]                                              
                      }]
                    }],   
          })
          .then((rows) => resolve({                    
            total: rows.count,
            data: rows.rows          
          }))
          .catch((reason) => reject({ message: reason.message }))
      })
    }

    static getItemsCobros(gestion,estado){
      return new Promise((resolve,reject) =>{
        PlanPagos.findAll({
            raw: true,
            nest: true,  
            where: {              
              [Op.and]: [
                { gestion: gestion},
                { isVenta: true},
                { estado: estado},
              ]
            },
            attributes: [[Sequelize.fn('sum',Sequelize.col('monto')),'total'],'mes'],
            group:['mes']                     
          })
          .then((rows) => resolve(rows))
          .catch((reason) => reject({ message: reason.message }))
      })
    }
    static getListaCobros(estado,desde,hasta){
      return new Promise((resolve,reject) =>{        
        PlanPagos.findAndCountAll({
            raw: true,
            nest: true,  
            where: {              
              [Op.and]: [                
                { isVenta: true},
                { estado: estado},
                { fechaPago: { [Op.between]: [desde, hasta]}},
              ]
            }, 
            include:[{
                      model:NotaCobranza,
                      as:"nota",
                      attributes:["id","detalle","ventaId"],
                      include:[{
                        model:Venta,
                        as:"venta",
                        attributes:["id","clients"]                                              
                      }]
                    }],   
          })
          .then((rows) => resolve({                    
            total: rows.count,
            data: rows.rows          
          }))
          .catch((reason) => reject({ message: reason.message }))
      })
    }
    static getItemCobros(gestion,estado){
      return new Promise((resolve,reject) =>{
        PlanPagos.findOne({
            raw: true,
            nest: true,  
            where: {              
              [Op.and]: [
                { gestion: gestion},
                { isVenta: true},
                { estado: estado},
              ]
            },            
            attributes: [  
              [Sequelize.fn('count',Sequelize.col('id')),'total'],
              [Sequelize.fn('sum',Sequelize.col('monto')),'suma']]                         
          })
          .then((rows) => resolve(rows))
          .catch((reason) => reject({ message: reason.message }))
      })
    }
    
}
export default PlanService;
