const express = require('express');
const controller = require('../controllers/UtilController');

const router = express.Router();

router.get('/status', controller.status);
router.get('/debug/headers', controller.debugHeaders);

module.exports = router;
