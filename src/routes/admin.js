const express = require('express');

const router = express.Router();

const productsController = require('../controllers/admin/products');

router.get('/edit-product/:productID', productsController.getEditProductPage);

router.get('/edit-product', productsController.getEditProductPage);

router.post('/edit-product', productsController.editProduct);

router.get('/products', productsController.getAllProducts);

module.exports = router;
