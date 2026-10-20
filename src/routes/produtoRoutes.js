const express = require('express');
const controller = require('../controllers/ProdutoController');

const router = express.Router();

/**
 * @openapi
 * /api/produtos/csv:
 *   get:
 *     tags: [Produtos]
 *     summary: Exporta todos os produtos em CSV
 *     responses:
 *       200:
 *         description: Arquivo CSV (`id,nome,preco`)
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: |
 *                 id,nome,preco
 *                 1,Ração Golden 15kg,189.9
 */
router.get('/csv', controller.exportarTodosCsv);

/**
 * @openapi
 * /api/produtos/{id}/csv:
 *   get:
 *     tags: [Produtos]
 *     summary: Exporta um produto em CSV
 *     parameters:
 *       - $ref: '#/components/parameters/ProdutoId'
 *     responses:
 *       200:
 *         description: Linha CSV do produto
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: 1,Ração Golden 15kg,189.9
 *       404:
 *         $ref: '#/components/responses/ProdutoNaoEncontrado'
 */
router.get('/:id/csv', controller.exportarUmCsv);

/**
 * @openapi
 * /api/produtos:
 *   get:
 *     tags: [Produtos]
 *     summary: Lista produtos
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtro parcial pelo nome (case insensitive)
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *   post:
 *     tags: [Produtos]
 *     summary: Cria um produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         $ref: '#/components/responses/ProdutoInvalido'
 */
router.get('/', controller.listar);
router.post('/', controller.criar);

/**
 * @openapi
 * /api/produtos/{id}:
 *   get:
 *     tags: [Produtos]
 *     summary: Busca um produto pelo id
 *     parameters:
 *       - $ref: '#/components/parameters/ProdutoId'
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       404:
 *         $ref: '#/components/responses/ProdutoNaoEncontrado'
 *   put:
 *     tags: [Produtos]
 *     summary: Atualiza um produto
 *     parameters:
 *       - $ref: '#/components/parameters/ProdutoId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoInput'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Produto'
 *       400:
 *         $ref: '#/components/responses/DadosInvalidos'
 *       404:
 *         $ref: '#/components/responses/ProdutoNaoEncontrado'
 *   delete:
 *     tags: [Produtos]
 *     summary: Remove um produto
 *     parameters:
 *       - $ref: '#/components/parameters/ProdutoId'
 *     responses:
 *       204:
 *         description: Produto removido
 *       404:
 *         $ref: '#/components/responses/ProdutoNaoEncontrado'
 */
router.get('/:id', controller.buscar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

module.exports = router;
