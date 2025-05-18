const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController');

router.get('/', indexController.indexGet);

router.route('/createBook').get(indexController.createBookGet);

module.exports = router;
