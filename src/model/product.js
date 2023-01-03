const fs = require('fs');

const path = require('path');

const appRootDir = require('../utils/path');

const pdtFilePath = path.join(appRootDir, 'data', 'db.json');

const getALLProducts = (cb) => {
  fs.readFile(pdtFilePath, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    return cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, price, image, description) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
    this.description = description;
  }

  save(cb) {
    getALLProducts((products) => {
      products.push(this);
      fs.writeFile(pdtFilePath, JSON.stringify(products), (err) => {
        if (!err) {
          return cb();
        }
        console.log('ERROR', err);
      });
    });
  }

  update(cb) {
    getALLProducts((products) => {
      products = products.map((product) => {
        if (product.id !== this.id) {
          return product;
        }
        return this;
      });
      fs.writeFile(pdtFilePath, JSON.stringify(products), (err) => {
        if (!err) {
          return cb();
        }
        console.log('ERROR', err);
      });
    });
  }

  static getProductDetailById(productID, cb) {
    getALLProducts((product) => {
      const productData = product.find(({ id }) => id === productID);
      cb(productData);
    });
  }

  static fetchAll(cb) {
    getALLProducts(cb);
  }
};
