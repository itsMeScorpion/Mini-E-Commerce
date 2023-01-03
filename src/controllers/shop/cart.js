const Cart = require('../../model/cart');
const Product = require('../../model/product');
const Model = require('../../model/wishlist');

exports.getAllProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    Cart.fetchAll((cartProducts) => {
      let formattedProducts = products.filter(({ id }) =>
        cartProducts.map(({ id }) => id).includes(id)
      );
      formattedProducts = formattedProducts.map((p) => ({
        ...p,
        qty: cartProducts.find(({ id }) => id === p.id).qty,
      }));

      res.render('shop/cart', {
        pageTitle: 'cart',
        products: formattedProducts,
        activeLink: '/cart',
        productslength: cartProducts.length,
      });
    });
  });
};

exports.editCart = (req, res, next) => {
  const productID = req.body.productID;
  Product.getProductDetailById(productID, (productDetails) => {
    Cart.addToCart(productDetails, () => {
      if (req.body.submit === 'add') {
        res.redirect('/wishlist');
      } else {
        res.redirect(`/products/${productID}`);
      }
    });
  });
};

exports.updateCart = (req, res, next) => {
  const productID = req.body.productID;
  const isAdd = +req.body.isAdd;
  Cart.updateCart(productID, isAdd, () => {
    res.redirect(`/cart`);
  });
};

exports.removeFromCart = (req, res, next) => {
  const productID = req.body.productID;
  Cart._removeFromCart(productID, () => {});
  res.redirect(`/products/${productID}`);
};
