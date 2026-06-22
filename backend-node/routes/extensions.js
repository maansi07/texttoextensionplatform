// Extensio.ai — Extension Routes
// Defines all REST endpoints for extension generation,
// retrieval, download and deletion

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/extensionController');

router.post('/generate/stream', ctrl.generateStream);
router.post('/generate/zip', ctrl.generateZip);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.delete('/:id', ctrl.deleteById);

module.exports = router;
