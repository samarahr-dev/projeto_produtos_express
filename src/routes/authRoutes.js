const express = require('express');
const controller = require('../controllers/AuthController');
const exigeLogin = require('../middlewares/exigeLogin');

const router = express.Router();

router.post('/login', controller.login);
router.get('/perfil', exigeLogin, controller.perfil);
router.post('/logout', controller.logout);
router.get('/acessos', controller.acessos);

module.exports = router;
