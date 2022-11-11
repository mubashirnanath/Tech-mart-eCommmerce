const db = require("../config/connection");
const collection = require("../config/collection");
const { ObjectId } = require("mongodb");

module.exports = {
  addCategory: (catId) => {
    catId.CategoryName = catId.CategoryName.toUpperCase();
    catId.Active = true;

    return new Promise(async (resolve, reject) => {
      try {
        let cat = await db
          .get()
          .collection(collection.CATEGORY_COLLECTION)
          .findOne({ CategoryName: catId.CategoryName });
        if (!cat) {
          await db
            .get()
            .collection(collection.CATEGORY_COLLECTION)
            .insertOne(catId)
            .then(() => {
              resolve();
            });
        } else {
          console.log("already exist");
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  viewCategory: () => {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .get()
          .collection(collection.CATEGORY_COLLECTION)
          .find()
          .toArray()
          .then((categories) => {
            resolve(categories);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  categoryStatus: (catID) => {
    return new Promise(async (resolve, reject) => {
      try {
        let category = await db
          .get()
          .collection(collection.CATEGORY_COLLECTION)
          .findOne({ _id: ObjectId(catID) });
        if (category.Active) {
          await db
            .get()
            .collection(collection.CATEGORY_COLLECTION)
            .updateOne({ _id: ObjectId(catID) }, { $set: { Active: false } });
        } else {
          await db
            .get()
            .collection(collection.CATEGORY_COLLECTION)
            .updateOne({ _id: ObjectId(catID) }, { $set: { Active: true } });
        }
        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  singleCatProucts: (catName) => {
    return new Promise(async (resolve, reject) => {
      try {
        let catProds = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ Category: catName })
        .toArray();
      resolve(catProds);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
};
