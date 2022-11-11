const db = require("../config/connection");
const collection = require("../config/collection");
const { ObjectId } = require("mongodb");

module.exports = {
  addToWishList: (userId, proId) => {
    let product = ObjectId(proId);
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db
          .get()
          .collection(collection.WISH_COLLECTION)
          .findOne({ user: ObjectId(userId) });
        if (user) {
          let proExist = user.products.findIndex((product) => product == proId);
          if (proExist != -1) {
            resolve({ Exist: true });
          } else {
            await db
              .get()
              .collection(collection.WISH_COLLECTION)
              .updateOne(
                { user: ObjectId(userId) },
                {
                  $push: { products: product },
                }
              )
              .then((response) => {
                resolve(response);
              });
          }
        } else {
          wishObj = {
            user: ObjectId(userId),
            products: [product],
          };
          await db
            .get()
            .collection(collection.WISH_COLLECTION)
            .insertOne(wishObj)
            .then((response) => {
              resolve({ status: true });
            });
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getWishListProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let wishlistProducts = await db
          .get()
          .collection(collection.WISH_COLLECTION)
          .aggregate([
            {
              $match: { user: ObjectId(userId) },
            },
            {
              $unwind: "$products",
            },
            {
              $lookup: {
                from: collection.PRODUCT_COLLECTION,
                localField: "products",
                foreignField: "_id",
                as: "product",
              },
            },
            {
              $unwind: "$product",
            },
          ])
          .toArray();
        resolve(wishlistProducts);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  deleteCartProduct: (wishId, proId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .get()
          .collection(collection.WISH_COLLECTION)
          .updateOne(
            { _id: ObjectId(wishId) },
            {
              $pull: { products: ObjectId(proId) },
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
  deleteWishProduct: (wishId, proId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .get()
          .collection(collection.WISH_COLLECTION)
          .updateOne(
            { _id: ObjectId(wishId) },
            {
              $pull: { products: ObjectId(proId) },
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
  getWishCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let count = 0;
        let wish = await db
          .get()
          .collection(collection.WISH_COLLECTION)
          .findOne({ user: ObjectId(userId) });
        if (wish) {
          count = wish.products.length;
        }
        resolve(count);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
};
