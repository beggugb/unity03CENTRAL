import { Router } from 'express';
import ClienteController from '../controllers/ClienteController';

const router = Router();
/** Simples */
router.get('/data/:pagina/:num/:prop/:orden',ClienteController.getData)
router.get('/item/:id',ClienteController.getItem)
router.get('/item/copiar/:id',ClienteController.setCopiar)
router.delete('/:id/:tipo',ClienteController.getDelete)
router.put('/:id/:tipo',ClienteController.actualizar)
router.post('/search/lista',ClienteController.search)
/** Compuestos */
router.post('/:tipo', ClienteController.crear);
router.post('/item/verificar/licencia/',ClienteController.getLicencia)

export default router;
