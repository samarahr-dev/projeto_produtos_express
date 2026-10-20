const express = require('express');
const controller = require('../controllers/UtilController');

const router = express.Router();

/**
 * @openapi
 * /api/status:
 *   get:
 *     tags: [Util]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: API em execução
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 hora:
 *                   type: string
 *                   format: date-time
 */
router.get('/status', controller.status);

/**
 * @openapi
 * /api/debug/headers:
 *   get:
 *     tags: [Util]
 *     summary: Inspeciona headers da requisição
 *     responses:
 *       200:
 *         description: Headers relevantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contentType:
 *                   type: string
 *                   nullable: true
 *                 userAgent:
 *                   type: string
 *                 autenticado:
 *                   type: boolean
 *                   description: True se o header Authorization estiver presente
 */
router.get('/debug/headers', controller.debugHeaders);

module.exports = router;
