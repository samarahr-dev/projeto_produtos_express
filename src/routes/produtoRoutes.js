const express = require('express');
const controller = require('../controllers/ProdutoController');

const router = express.Router();

// as rotas de CSV precisam vir antes de "/:id", senão "csv" seria
// interpretado como um id
router.get('/csv', controller.exportarTodosCsv);
router.get('/:id/csv', controller.exportarUmCsv);

router.get('/', controller.listar);
router.get('/:id', controller.buscar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

module.exports = router;
