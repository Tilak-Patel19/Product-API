const express = require('express');
const productController = require('../Controllers/productController');
const userController = require('./../Controllers/userController');

const router = express.Router();

router.post('/create', userController.isLoggedIn, userController.restrictTo('admin'), productController.createProduct);

router.get('/list', userController.isLoggedIn, productController.getProductList);

router.get('/', userController.isLoggedIn, productController.getProductListWithFilter);

router.get('/:productId', userController.isLoggedIn, productController.getProductDetails);

router.put('/:productId', userController.isLoggedIn, userController.restrictTo('admin'), productController.updateProduct);

router.delete('/:productId', userController.isLoggedIn, userController.restrictTo('admin'), productController.deleteProduct);

module.exports = router;
