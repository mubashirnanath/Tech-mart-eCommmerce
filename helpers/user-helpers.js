const db = require("../config/connection");
const collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { response } = require("express");
const TaskRouterCapability = require("twilio/lib/jwt/taskrouter/TaskRouterCapability");
const Razorpay = require("razorpay");
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

var instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

module.exports = {
  getUserDetails: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ _id: ObjectId(userId) });

        resolve(user);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let detail = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ Email: userData.Email });
        if (!detail) {
          resolve("success");
        } else {
          resolve("user already exist");
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  insertData: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        userData.Password = await bcrypt.hash(userData.Password, 10);
        userData.confirmPassword = await bcrypt.hash(
          userData.confirmPassword,
          10
        );
        userData.Active = true;
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((response)=>{
          console.log(response,454545);
          resolve(response);
        })
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = {};
        let user = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ Email: userData.Email });
        if (user) {
          bcrypt.compare(userData.Password, user.Password).then((status) => {
            if (status && user.Active == true) {
              console.log("Login Success");
              response.user = user;
              response.status = true;
              resolve(response);
            } else {
              console.log("Login Failed");
              response.status = false;
              resolve({ response });
            }
          });
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  verifyOtp: (otp, phoneNumber) => {
    return new Promise(async (resolve, reject) => {
      try {
        await client.verify
          .services(process.env.SERVICE_SID)
          .verificationChecks.create({
            to: `+91${phoneNumber}`,
            code: otp,
          })
          .then((verification) => {
            resolve(verification.valid);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  editProfile: (userId, userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let editProfile = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .updateOne(
            {
              _id: ObjectId(userId),
            },
            {
              $set: {
                Name: userData.Name,
                DOB: userData.DOB,
              },
            }
          );
        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  addAddress: (userId, addressData) => {
    create_random_id(15);
    function create_random_id(string_Length) {
      var randomString = "";
      var numbers = "1234567890";
      for (var i = 0; i < string_Length; i++) {
        randomString += numbers.charAt(
          Math.floor(Math.random() * numbers.length)
        );
      }
      addressData._addId = "ADD" + randomString;
    }

    let subAddress = {
      _addId: addressData._addId,
      Name: addressData.Name,
      Phone: addressData.Phone,
      Street: addressData.Street,
      State: addressData.State,
      City: addressData.City,
      Address: addressData.Address,
      Pincode: addressData.Pincode,
    };
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ _id: ObjectId(userId) });
        if (user.Addresses) {
          if (user.Addresses.length < 4) {
            await db
              .get()
              .collection(collection.USER_COLLECTION)
              .updateOne(
                { _id: ObjectId(userId) },
                {
                  $push: { Addresses: subAddress },
                }
              );
            resolve();
          } else {
            resolve({ full: true });
          }
        } else {
          Addresses = [subAddress];
          await db
            .get()
            .collection(collection.USER_COLLECTION)
            .updateOne({ _id: ObjectId(userId) }, { $set: { Addresses } });
          resolve();
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getAddress: (userId, addId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let address = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .aggregate([
            {
              $match: {
                _id: ObjectId(userId),
              },
            },
            {
              $unwind: "$Addresses",
            },
            {
              $project: { Addresses: 1 },
            },
            {
              $match: { "Addresses._addId": addId },
            },
          ])
          .toArray();
        resolve(address[0]);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  applyCoupon: (couponName, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await db
          .get()
          .collection(collection.COUPON_COLLECTION)
          .findOne({ Value: couponName });
        if (result) {
          var d = new Date();
          let str = d.toJSON().slice(0, 10);
          if (str >= result.Expiry_Date) {
            resolve({ expired: true });
          } else {
            let user = await db
              .get()
              .collection(collection.COUPON_COLLECTION)
              .findOne({
                Name: couponName,
                users: { $in: [ObjectId(userId)] },
              });
            if (user) {
              resolve({ used: true });
            } else {
              resolve(result);
            }
          }
        } else {
          resolve({ notAvailable: true });
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getCartProductList: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cart = await db
          .get()
          .collection(collection.CART_COLLECTION)
          .findOne({ user: ObjectId(userId) });
        resolve(cart.products);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  placeOrder: (order, products, total, couponName) => {
    return new Promise(async (resolve, reject) => {
      try {
        let status = order.Payment_method === "COD" ? "Placed" : "Pending";
        let orderObj = {
          deliveryDetails: {
            Name: order.Name,
            Address: order.Address,
            City: order.City,
            State: order.State,
            Street: order.Street,
            Pincode: order.Pincode,
            Phone: order.Phone,
          },
          userId: ObjectId(order.userId),
          PaymentMethod: order.Payment_method,
          products: products,
          TotalAmount: parseInt(total),
          discount: parseInt(order.discount),
          grandTotal: parseInt(order.grandTotal),
          status: status,
          Active: true,
          date: new Date(),
        };
        let users = [order.userId];
        await db.get().collection(collection.COUPON_COLLECTION).updateOne(
          { CouponName: couponName },
          {
            $set: { users },
          }
        );
        let data = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .insertOne(orderObj);
        await db
          .get()
          .collection(collection.CART_COLLECTION)
          .deleteOne({ user: ObjectId(order.userId) });
        resolve(data);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  generateRazorpay: (orderId, grandTotal) => {
    return new Promise((resolve, reject) => {
      try {
        var options = {
          amount: grandTotal * 100,
          currency: "INR",
          receipt: "" + orderId,
        };
        instance.orders.create(options, function (err, order) {
          if (err) {
            console.log(err);
          } else {
            resolve(order);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getOrderDetails: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let orders = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .aggregate([
            {
              $match: { userId: ObjectId(userId) },
            },
            {
              $project: {
                deliveryDetails: 1,
                userId: 1,
                PaymentMethod: 1,
                products: 1,
                totalAmount: 1,
                discount: 1,
                grandTotal: 1,
                status: 1,
                date: { $dateToString: { format: "%d-%m-%Y", date: "$date" } },
                cancelStatus: 1,
                deliveryStatus: 1,
                returnStatus: 1,
              },
            },
          ])
          .sort({ date: -1 })
          .toArray();
        resolve(orders);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getSingleOrderDetails: (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let orderProduct = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .aggregate([
            {
              $match: { _id: ObjectId(orderId) },
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
                proTotal: {
                  $sum: {
                    $multiply: ["$quantity", { $toInt: "$product.Price" }],
                  },
                },
              },
            },
          ])
          .toArray();
        resolve(orderProduct);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  getSingleOrder: (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let order = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .findOne({ _id: ObjectId(orderId) });
        resolve(order);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  verifyPayment: (details) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "IGqkZUqJrjka2NnPGEGdX2IK");
      hmac.update(
        details["payment[razorpay_order_id]"] +
          "|" +
          details["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == details["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },
  changePaymentStatus:(orderId)=>{
    return new Promise(async (resolve, reject) => {
        let response = await db.get().collection(collection.ORDER_COLLECTION).updateOne(
          {_id:ObjectId(orderId)},
          {
            $set:{
              status:'Placed'
            }
          }
        )
        resolve()
    })
  },
  getsingleOrder:(orderId)=>{
    return new Promise(async(resolve, reject) => {
      try {
        let response = await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:ObjectId(orderId)})
        resolve(response)
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },
  addReview:(reviewDetails)=>{
    return new Promise(async(resolve, reject) => {
      try {
        console.log(reviewDetails);
        let proId = reviewDetails.proId
        let product = await db.get().collection(collection.REVIEW_COLLECTION).findOne({product:ObjectId()})
        resolve(response)
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  }
};


