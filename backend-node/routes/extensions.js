const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/extensionController');

router.post('/generate', ctrl.generate);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.get('/:id/download', ctrl.downloadZip);
router.delete('/:id', ctrl.deleteById);

module.exports = router;