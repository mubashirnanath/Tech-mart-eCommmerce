const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");

module.exports = {
  doLogin: (req) => {
    return new Promise(async (resolve, reject) => {
      try {
        let admin = await db
          .get()
          .collection(collection.ADMIN_COLLECTION)
          .findOne({ Email: req.body.Email });
        if (admin) {
          if (req.body.Password == admin.Password) {
            req.session.admin = true;
            resolve("success");
          }
        } else {
          req.session.admin = false;
          resolve("check Email or Password");
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getAllUsers: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let users = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .find()
          .toArray();
        resolve(users);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  addCoupon: (couponDetails) => {
    couponDetails.Amount = parseInt(couponDetails.Amount);
    couponDetails.Active = true;
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .get()
          .collection(collection.COUPON_COLLECTION)
          .insertOne(couponDetails);
        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getCoupon: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let coupons = await db
          .get()
          .collection(collection.COUPON_COLLECTION)
          .find()
          .toArray();
        resolve(coupons);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  couponStatus: (couponId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let coupon = await db
          .get()
          .collection(collection.COUPON_COLLECTION)
          .findOne({ _id: ObjectId(couponId) });
        if (coupon.Active) {
          await db
            .get()
            .collection(collection.COUPON_COLLECTION)
            .updateOne(
              { _id: ObjectId(couponId) },
              { $set: { Active: false } }
            );
        } else {
          await db
            .get()
            .collection(collection.COUPON_COLLECTION)
            .updateOne({ _id: ObjectId(couponId) }, { $set: { Active: true } });
        }
        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let orders = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .find()
          .toArray();
        let date = orders[0].date;
        let hai = date.toDateString();
        resolve(orders);
      } catch (error) {
        
      }
    });
  },
  changeDeliveryStatus:(orderId,newstatus)=>{
    return new Promise(async(resolve, reject) => {
      try {
        await db.get().collection(collection.ORDER_COLLECTION).updateOne(
          {_id:ObjectId(orderId)},
          {
            $set:{status:newstatus}
          }
          )
          resolve()
      } catch (error) {
        console.log(error);
        reject(error);
      }
      
    })
  },
  cancelOrder:(orderId)=>{
    return new Promise(async(resolve, reject) => {
      try {
        let cancelorder  = await db.get().collection(collection.ORDER_COLLECTION).updateOne(
          {
            _id:ObjectId(orderId)
          },
          {
            $set:{Active:false,status:'Cancelled'}
          }
        )
        resolve()
      } catch (error) {
        console.log(error);
        reject(error);
      }
      
    })
  },
  salesReport:()=>{
    return new Promise(async(resolve, reject) => {
      try {
        let report = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
        resolve(report)
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },
  totalRevenue:()=>{
    return new Promise(async(resolve, reject) => {
      try {
        let totalRevenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate(
          [
            {
              $group:{
                _id:null,
                totalRevenue:{$sum:"$grandTotal"}
              }
            }
          ]
        ).toArray()
        resolve(totalRevenue[0])
        console.log(totalRevenue[0]);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },
  ordersCount:()=>{
    return new Promise(async(resolve, reject) => {
      try {
        let count = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
          {
              $match: { "status": 'Delivered' }
          },
          {
              $group: {
                  _id: '$PaymentMethod', count: { $sum: 1 }
              }
          },
          {
              $project: {
                  _id: 0,
                  PaymentMethod: '$_id',
                  count: '$count'
              }
    
          },
          {
              $sort: { PaymentMethod: 1 }
          }
      ]).toArray()
      resolve(count)
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },
  totalRevenueGraph:()=>{
    return new Promise(async(resolve, reject) => {
      try {
        let today = new Date()
                let before = new Date(new Date().getTime() - (250 * 24 * 60 * 60 * 1000))
                let revenue = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $match: {
                            status: 'Delivered',
                            date: {
                                $gte: before,
                                $lte: today
                            }
                        }
                    },
                    {
                        $project: {
                            PaymentMethod: 1, grandTotal: 1, date: 1
                        }
                    },
                    {
                        $group: {
                            _id: { date: { $dateToString: { format: "%m-%Y", date: "$date" } }, paymentMethod: '$PaymentMethod' },
                            Amount: { $sum: '$grandTotal' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            date: '$_id.date',
                            PaymentMethod: '$_id.paymentMethod',
                            amount: '$Amount',
                        }
                    }
                ]).sort({ date: 1 }).toArray()
                let obj = {
                    date: [], cod: [0, 0, 0, 0, 0, 0, 0, 0], online: [0, 0, 0, 0, 0, 0, 0, 0]
                }
                let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                let a = today.getMonth() - 6
                for (let i = 0; i < 8; i++) {
                    for (let k = 0; k < revenue.length; k++) {
                        if (Number(revenue[k].date.slice(0, 2)) == Number(a + i)) {
                            if (revenue[k].PaymentMethod == 'Online Payment') {
                                obj.online[i] = revenue[k].amount
                            } else {
                                obj.cod[i] = revenue[k].amount
                            }
                        }
                    }
                    obj.date[i] = month[a + i - 1]
                }
                resolve(obj) 
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },
  userStatus:(userId)=>{
    return new Promise(async(resolve, reject) => {
      try {
        let user = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ _id: ObjectId(userId) });
        if (user.Active) {
          await db
            .get()
            .collection(collection.USER_COLLECTION)
            .updateOne({ _id: ObjectId(userId) }, { $set: { Active: false } });
        } else {
          await db
            .get()
            .collection(collection.USER_COLLECTION)
            .updateOne({ _id: ObjectId(userId) }, { $set: { Active: true } });
        }
        resolve();
      } catch (error) {
        
      }
    })
  }
};
