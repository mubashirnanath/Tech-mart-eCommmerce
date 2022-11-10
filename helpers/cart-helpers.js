const db = require("../config/connection");
const collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { response } = require("express");
const { getProduct } = require("../controller/UserController");

module.exports = {
  addToCart: (proId, userId) => {
    let proObj = {
      item: ObjectId(proId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      try {
        let userCart = await db
          .get()
          .collection(collection.CART_COLLECTION)
          .findOne({ user: ObjectId(userId) });
        if (userCart) {
          let proExist = userCart.products.findIndex(
            (products) => products.item == proId
          );
          if (proExist != -1) {
            db.get()
              .collection(collection.CART_COLLECTION)
              .updateOne(
                { user: ObjectId(userId), "products.item": ObjectId(proId) },
                {
                  $inc: { "products.$.quantity": 1 },
                }
              )
              .then(() => {
                resolve();
              });
          } else {
            db.get()
              .collection(collection.CART_COLLECTION)
              .updateOne(
                { user: ObjectId(userId) },
                {
                  $push: { products: proObj },
                }
              )
              .then(() => {
                resolve();
              });
          }
        } else {
          let cartObj = {
            user: ObjectId(userId),
            products: [proObj],
          };
          db.get()
            .collection(collection.CART_COLLECTION)
            .insertOne(cartObj)
            .then((response) => {
              resolve();
            });
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getCartProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cartItems = await db
          .get()
          .collection(collection.CART_COLLECTION)
          .aggregate([
            {
              $match: { user: ObjectId(userId) },
            },
            {
              $unwind: "$products",
            },
            {
              $project: {
                item: "$products.item",
                quantity: "$products.quantity",
              },
            },
            {
              $lookup: {
                from: collection.PRODUCT_COLLECTION,
                localField: "item",
                foreignField: "_id",
                as: "product",
              },
            },
            {
              $unwind: "$product",
            },
            {
              $project: {
                item: 1,
                quantity: 1,
                product: 1,
              },
            },
          ])
          .toArray();

        resolve(cartItems);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        let cart = await db
          .get()
          .collection(collection.CART_COLLECTION)
          .findOne({ user: ObjectId(userId) });

        if (cart) {
          count = cart.products.length;
        }
        resolve(count);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  changeProductQuantity: (details) => {
    details.count = parseInt(details.count);
    details.quantity = parseInt(details.quantity);
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            {
              _id: ObjectId(details.cart),
              "products.item": ObjectId(details.product),
            },
            {
              $inc: { "products.$.quantity": details.count },
            }
          )
          .then(() => {
            resolve();
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  deleteCartProduct: (cartId, proId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            { _id: ObjectId(cartId) },
            {
              $pull: { products: { item: ObjectId(proId) } },
            }
          )
          .then((response) => {
            resolve({ response });
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let total = await db
          .get()
          .collection(collection.CART_COLLECTION)
          .aggregate([
            {
              $match: { user: ObjectId(userId) },
            },
            {
              $unwind: "$products",
            },
            {
              $project: {
                item: "$products.item",
                quantity: "$products.quantity",
              },
            },
            {
              $lookup: {
                from: collection.PRODUCT_COLLECTION,
                localField: "item",
                foreignField: "_id",
                as: "product",
              },
            },
            {
              $unwind: "$product",
            },
            {
              $group: {
                _id: null,
                total: { $sum: { $multiply: ["$product.Price", "$quantity"] } },
              },
            },
          ])
          .toArray();

        resolve(total[0].total);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  addWishList: (proId, userId) => {},
};
