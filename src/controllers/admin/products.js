const Product = require('../../model/product');
const cart = require('../../model/cart');

const { v1: uuidv1 } = require('uuid');

exports.getEditProductPage = (req, res, next) => {
  cart.fetchAll((idss) => {
    let isEditable = false;
    if (req.params.productID) {
      isEditable = true;
    }
    if (!isEditable) {
      return res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        activeLink: 'admin/edit-product',
        isEditable: false,
        productslength: idss.length,
      });
    }

    Product.getProductDetailById(req.params.productID, (productData) => {
      return res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        activeLink: 'admin/edit-product',
        productData,
        isEditable: true,
        productslength: idss.length,
      });
    });
  });
};

exports.editProduct = (req, res, next) => {
  const { productId, title, price, image, description } = req.body;
  const product = new Product(
    productId ? productId : uuidv1(),
    title,
    price,
    image,
    description
  );


  if (productId) {
    product.update(() => {
      res.redirect('/admin/products');
    });
  } else {
    product.save(() => {
      res.redirect('/admin/products');
    });
  }
};

exports.getAllProducts = (req, res, next) => {
  Product.fetchAll((pdt) => {
    cart.fetchAll((idss) => {
      res.render('admin/list', {
        pageTitle: 'Admin List',
        products: pdt,
        activeLink: '/admin/list',
        productslength: idss.length,
      });
    });
  });
};
