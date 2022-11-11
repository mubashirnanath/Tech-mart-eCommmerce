const db = require("../config/connection");
const collection = require("../config/collection");
const { ObjectId } = require("mongodb");
const { response } = require("express");

module.exports = {
  addProducts: (product) => {
    return new Promise((resolve, reject) => {
      try {
        product.Active = true;
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .insertOne(product)
          .then((data) => {
            resolve();
          });
      } catch (error) {
        reject(error);
      }
    });
  },
  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      try {
        let products = db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .find()
          .toArray();
        resolve(products);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getProductDetails: (prodID) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .findOne({ _id: ObjectId(prodID) })
          .then((product) => {
            resolve(product);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  upadteProduct: (proId, ProDetails) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateOne(
            { _id: ObjectId(proId) },
            {
              $set: {
                Name: ProDetails.Name,
                Category: ProDetails.Category,
                Price: ProDetails.Price,
                Description: ProDetails.Description,
                Quantity: ProDetails.Quantity,
                Image: ProDetails.Image,
              },
            }
          )
          .then((response) => {
            resolve();
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  upadteProduct1: (proId, ProDetails) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateOne(
            { _id: ObjectId(proId) },
            {
              $set: {
                Name: ProDetails.Name,
                Category: ProDetails.Category,
                Price: ProDetails.Price,
                Description: ProDetails.Description,
                Quantity: ProDetails.Quantity,
              },
            }
          )
          .then((response) => {
            resolve();
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  productStatus: (proID) => {
    return new Promise(async (resolve, reject) => {
      try {
        let product = await db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .findOne({ _id: ObjectId(proID) });
        if (product.Active) {
          await db
            .get()
            .collection(collection.PRODUCT_COLLECTION)
            .updateOne({ _id: ObjectId(proID) }, { $set: { Active: false } });
        } else {
          await db
            .get()
            .collection(collection.PRODUCT_COLLECTION)
            .updateOne({ _id: ObjectId(proID) }, { $set: { Active: true } });
        }
        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
};
