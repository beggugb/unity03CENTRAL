
import database from "../../src/models";

const { Modulo } = database;

class ModuloService {

    static getList(rolId){
        return new Promise((resolve,reject) =>{            
            Modulo.findAll({
              raw: true,
              nest: true,               
              where:{ rolId: rolId }, 
              order: [['name','ASC']],
              attributes:['id','path','name','component','layout','enabled','icon']              
            })
            .then((rows) => resolve(rows))
            .catch((reason) => reject({ message: reason.message }))             
        })

    }
    static getListSingle(rolId){
      return new Promise((resolve,reject) =>{            
          Modulo.findAll({
            raw: true,
            nest: true,               
            where:{ rolId: rolId }, 
            order: [['name','ASC']],
            attributes:['id','name']              
          })
          .then((rows) => resolve(rows))
          .catch((reason) => reject({ message: reason.message }))             
      })

  }

}
  export default ModuloService; 