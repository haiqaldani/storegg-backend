var express = require('express');
var router = express.Router();
const { index, viewCreate, actionCreate, viewEdit, actionEdit, actionDelete, actionStatus } = require('./controller')
const { uploadMiddleware } = require('../middleware/uploadMiddleware');
const { uploadToImgur } = require('../middleware/imgurMiddleware');
const { isLoginAdmin } = require('../middleware/auth')

router.use(isLoginAdmin)
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', uploadMiddleware, uploadToImgur, actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', uploadMiddleware, uploadToImgur, actionEdit);
router.delete('/delete/:id', actionDelete);
router.put('/status/:id', actionStatus);

module.exports = router;
