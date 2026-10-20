const express = require('express');
const controller = require('../controllers/AuthController');
const exigeLogin = require('../middlewares/exigeLogin');

const router = express.Router();

/**
 * @openapi
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: Inicia a sessão
 *     description: Valida o `access_token` e cria o cookie de sessão.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [access_token]
 *             properties:
 *               access_token:
 *                 type: string
 *                 example: seu_token
 *     responses:
 *       200:
 *         description: Sessão iniciada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensagem'
 *       401:
 *         $ref: '#/components/responses/TokenInvalido'
 */
router.post('/login', controller.login);

/**
 * @openapi
 * /api/perfil:
 *   get:
 *     tags: [Auth]
 *     summary: Dados da sessão autenticada
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Perfil da sessão
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 autenticado:
 *                   type: boolean
 *                   example: true
 *                 logadoEm:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/NaoAutenticado'
 */
router.get('/perfil', exigeLogin, controller.perfil);

/**
 * @openapi
 * /api/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Encerra a sessão
 *     responses:
 *       200:
 *         description: Sessão encerrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mensagem'
 *       500:
 *         $ref: '#/components/responses/FalhaLogout'
 */
router.post('/logout', controller.logout);

/**
 * @openapi
 * /api/acessos:
 *   get:
 *     tags: [Auth]
 *     summary: Contador de listagens de produtos na sessão
 *     description: Incrementado a cada `GET /api/produtos`.
 *     responses:
 *       200:
 *         description: Total de acessos na sessão atual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acessos:
 *                   type: integer
 *                   example: 3
 */
router.get('/acessos', controller.acessos);

module.exports = router;
