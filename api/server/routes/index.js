import KeyToken from './keyToken'
import usuarios from './usuarioRoutes'
import clientes from './clienteRoutes'

export default(app) => {    
    app.use('/api/usuarios',usuarios);              
    app.use('/api/clientes',clientes);    
}

