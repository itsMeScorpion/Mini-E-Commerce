const fs = require('fs');

const path = require('path');

const appRootDir = require('../utils/path');

const wishlistFilePath = path.join(appRootDir, 'data', 'wishlist.json');

const getAllCartPoducts = (cb) => {
  fs.readFile(wishlistFilePath, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    return cb(JSON.parse(fileContent));
  });
};
module.exports = class Cart {
  constructor(id) {
    this.id = id;
  }
  static _removeFromCart(productID, cb) {
    getAllCartPoducts((products) => {
      products = products.filter(({ id }) => id !== productID);

      fs.writeFile(wishlistFilePath, JSON.stringify(products), (err) => {
        if (!err) {
          cb();
        }
      });
    });
  }
  static addToCart(prductDetails, cb) {
    getAllCartPoducts((products) => {
      products.push({
        id: prductDetails.id,
      });

      fs.writeFile(wishlistFilePath, JSON.stringify(products), (err) => {
        if (!err) {
          cb();
        }
      });
    });
  }
  static fetchAll(cb) {
    getAllCartPoducts(cb);
  }
};
