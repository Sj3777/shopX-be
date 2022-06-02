const express = require('express');
let router = express.Router();
const productController = require('../controller/product')

router.post('/add-product', productController.addProduct);
router.get('/get-product', productController.getProduct);
router.post('/signup', productController.signup);
router.post('/login', productController.login);
router.get('/get-users', productController.getAllUsers);
router.post('/add-to-cart', productController.addToCart);
router.get('/get-cart', productController.getCart);
module.exports = router;