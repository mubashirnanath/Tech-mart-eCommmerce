const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");

module.exports = {
  addBanner: (banner) => {
    return new Promise((resolve, reject) => {
      try {
        banner.Active = true;
        db.get()
          .collection(collection.BANNER_COLLECTION)
          .insertOne(banner)
          .then((data) => {
            resolve();
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  viewBanner: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let banner = await db
          .get()
          .collection(collection.BANNER_COLLECTION)
          .find()
          .toArray();
        resolve(banner);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  changeStatus:(banId)=>{
    return new Promise(async(resolve, reject) => {
      try {
        let banner = await db.get().collection(collection.BANNER_COLLECTION).find({_id:ObjectId(banId)}).toArray()
        if(banner[0].Active){
          await db.get().collection(collection.BANNER_COLLECTION).updateOne(
            {
              _id:ObjectId(banId)
            },
            {
              $set:{Active:false}
            }
          )
         
        }else{
          await db.get().collection(collection.BANNER_COLLECTION).updateOne(
            {
              _id:ObjectId(banId)
            },
            {
              $set:{Active:true}
            }
          )
          
        }
        resolve()
      } catch (error) {
        
      }
    })
  }
};
