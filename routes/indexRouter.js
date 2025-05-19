const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController');

router.get('/', indexController.indexGet);

router
  .route('/createBook')
  .get(indexController.createBookGet)
  .post(indexController.createBookPost);

router.post('/delete/:id', indexController.deleteBookPost);

module.exports = router;
