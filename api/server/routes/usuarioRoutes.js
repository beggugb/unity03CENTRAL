import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';
import KeyToken from './keyToken'
const router = Router();

router.post('/login', UsuarioController.login);

router.get('/data/:pagina/:num/:prop/:orden',UsuarioController.getData)
router.get('/item/:id',UsuarioController.getItem)
router.put('/:id/:tipo',UsuarioController.actualizar)
router.post('/crear/:tipo',UsuarioController.crear)
router.get('/list/:prop/:orden',UsuarioController.getItems);
export default router;
