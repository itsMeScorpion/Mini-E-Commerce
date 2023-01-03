const Wishlist = require('../../model/wishlist');
const Product = require('../../model/product');
const Cart = require('../../model/cart');

exports.editWishlist = (req, res, next) => {
  const productID = req.body.productID;
  Product.getProductDetailById(productID, (productDetails) => {
    Wishlist.addToCart(productDetails, () => {
      res.redirect(`/products/${productID}`);
    });
  });
};

exports.removeFromWishlist = (req, res, next) => {
  const productID = req.body.productID;
  Wishlist._removeFromCart(productID, () => {});
  if (req.body.submit === 'remove') {
    res.redirect('/wishlist');
  } else {
    res.redirect(`/products/${productID}`);
  }
};

exports.getViewProductPage = (req, res, next) => {
  Wishlist.fetchAll((ids) => {
    Cart.fetchAll((idss) => {
      Product.getProductDetailById(req.params.productID, (productData) => {
        return res.render('shop/view-product', {
          pageTitle: 'View Product',
          activeLink: '/',
          productData,
          isInWishlist:
            ids.filter(({ id }) => id === productData.id).length > 0,
          iscart: idss.filter(({ id }) => id === productData.id).length > 0,
          productslength: idss.length,
        });
      });
    });
  });
};

exports.getAllProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    Wishlist.fetchAll((cartProducts) => {
      Cart.fetchAll((idss) => {
        let formattedProducts = products.filter(({ id }) =>
          cartProducts.map(({ id }) => id).includes(id)
        );
        formattedProducts = formattedProducts.map((p) => ({
          ...p,
          qty: cartProducts.find(({ id }) => id === p.id).qty,
        }));
        res.render('shop/Wishlist', {
          pageTitle: 'Wishlist',
          products: formattedProducts,
          activeLink: '/wishlist',
          productslength: idss.length,
          iscart:
            idss.filter(({ id }) =>
              cartProducts.map(({ id }) => id).includes(id)
            ).length > 0,
        });
      });
    });
  });
};
