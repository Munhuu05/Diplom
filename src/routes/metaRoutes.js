const express = require('express');
const metaController = require('../controllers/metaController');

const router = express.Router();

router.get('/grades', metaController.getConcreteGrades);

module.exports = router;
