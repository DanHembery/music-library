const express = require('express');

const albumController = require('../controllers/album');

const router = express.Router();

router.get('/', albumController.read);

router.get('/:albumId', albumController.readById);

router.patch('/:albumId', albumController.update);

router.delete('/:albumId', albumController.delete)

module.exports = router;