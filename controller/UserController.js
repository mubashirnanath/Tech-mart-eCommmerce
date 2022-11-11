const multer = require("multer");
const { default: Swal } = require("sweetalert2");
const userHelpers = require("../helpers/user-helpers");
const productHelpers = require("../helpers/product-helpers");
const categoryHelpers = require("../helpers/category-helpers");
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

const cartHelpers = require("../helpers/cart-helpers");
const wishListHelpers = require("../helpers/wish-list-helpers");
const { response } = require("express");
const bannerHelpers = require("../helpers/banner-helpers");

// HOME PAGE
exports.getHome = async (req, res, next) => {
  try {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await cartHelpers.getCartCount(req.session.user._id);
      req.session.cart = cartCount;
      let wishCount = await wishListHelpers.getWishCount(req.session.user._id);
      req.session.wishCount = wishCount;
    }
    let banner = await bannerHelpers.viewBanner();
    let products = await productHelpers.getAllProducts();
    let category = await categoryHelpers.viewCategory();
    res.render("users/home", {
      Name: req.session.user,
      products,
      banner,
      category,
      cartCount: req.session.cart,
      wishCount: req.session.wishCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// SIGN-IN
exports.getLogin = (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      res.redirect("/");
    }
      res.render("users/sign-in", { Name: req.session.user ,logErr:req.flash('logErr')});
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.postLogin = (req, res, next) => {
  try {
    userHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect("/");
      } else {
        req.flash('logErr','Invallid username or Password');
        req.session.loggedIn = false;
        res.redirect("/sign-in");
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// SIGN-UP
exports.getRegister = (req, res, next) => {
  try {
    res.render("users/sign-up");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.postRegister = (req, res, next) => {
  try {
    client.verify.v2
      .services(process.env.SERVICE_SID)
      .verifications.create({
        to: `+91${req.body.Number}`,
        channel: "sms",
      })
      .then((verification) => {
        console.log("reached here");
      })
      .catch((err) => {
        console.log(err);
      });

    req.session.detail = req.body;
    res.redirect("/verify-otp");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getOtp = (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      res.redirect("/");
    } else {
      userHelpers.doSignup(req.session.detail).then((response) => {
        res.render("users/verify-otp");
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.postOtp = async (req, res, next) => {
  try {
    let Number = req.session.detail.Number;
    console.log(req.session.detail);
    await userHelpers.verifyOtp(req.body.otp, Number).then((response) => {
      userHelpers.insertData(req.session.detail).then((response) => {
        req.session.loggedIn = true;
        req.session.user = req.session.detail;
        res.redirect("/");
      });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getProduct = (req, res, next) => {
  try {
    categoryHelpers.viewCategory().then((category) => {
      productHelpers.getAllProducts().then((products) => {
        res.render("users/products", {
          Name: req.session.user,
          products,
          category,
          cartCount: req.session.cart,
          wishCount: req.session.wishCount,
        });
      });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getProductDetails = async (req, res, next) => {
  try {
    let catName = req.params.catName;
    let catProds = await categoryHelpers.singleCatProucts(catName);
    let productDetail = await productHelpers.getProductDetails(req.params.id);
    if (req.session.user) {
      cartCount = await cartHelpers.getCartCount(req.session.user._id);
      req.session.cart = cartCount;
    }
    res.render("users/product-details", {
      Name: req.session.user,
      cartCount: req.session.cart,
      productDetail,
      catProds,
      wishCount: req.session.wishCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getcontactPage = (req, res, next) => {
  try {
    res.render("users/contact", {
      Name: req.session.user,
      cartCount: req.session.cart,
      wishCount: req.session.wishCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.postLogout = (req, res, next) => {
  try {
    req.session.user = null;
    req.session.loggedIn = false;
    req.session.cart = null;
    res.redirect("/");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getProfile = (req, res, next) => {
  try {
    res.render("users/profile", {
      Name: req.session.user,
      cartCount: req.session.cart,
      wishCount: req.session.wishCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getCartItems = async (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      await cartHelpers
        .addToCart(req.params.id, req.session.user._id)
        .then((response) => {
          res.json({ status: true });
        });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getCart = async (req, res, next) => {
  try {
    let products = await cartHelpers.getCartProducts(req.session.user._id);
    req.session.cartProds = products;
    let cartCount = null;
    cartCount = await cartHelpers.getCartCount(req.session.user._id);
    req.session.cart = cartCount;
    if (cartCount > 0) {
      let Total = await cartHelpers.getTotalAmount(req.session.user._id);
      req.session.subTotal = Total;
    }
    res.render("users/cart", {
      Name: req.session.user,
      products: req.session.cartProds,
      Total: req.session.subTotal,
      cartCount: req.session.cart,
      wishCount: req.session.wishCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.changeProductQuantity = async (req, res, next) => {
  try {
    await cartHelpers.changeProductQuantity(req.body).then(() => {
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.deleteCartProduct = async (req, res, next) => {
  try {
    cartId = req.params.cartId;
    proId = req.params.proId;
    await cartHelpers.deleteCartProduct(cartId, proId).then((response) => {
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.addToWishList = async (req, res, next) => {
  try {
    let response = await wishListHelpers.addToWishList(
      req.session.user._id,
      req.params.id
    );
    if (req.session.user) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getWishListProducts = async (req, res, next) => {
  try {
    let wish = await wishListHelpers.getWishListProducts(req.session.user._id);
    cartCount = await cartHelpers.getCartCount(req.session.user._id);
    req.session.cart = cartCount;
    let wishCount = await wishListHelpers.getWishCount(req.session.user._id);
    req.session.wishCount = wishCount;
    res.render("users/wish-list", {
      Name: req.session.user,
      wish,
      cartCount: req.session.cart,
      wishCount: req.session.wishCount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.deleteWishProduct = async (req, res, next) => {
  try {
    wishId = req.params.wishId;
    proId = req.params.proId;
    await wishListHelpers.deleteWishProduct(wishId, proId).then((response) => {
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getCheckout = async (req, res, next) => {
  try {
    let user = await userHelpers.getUserDetails(req.session.user._id);
    let address = user.Addresses;
    let cartCount = null;
    if (req.session.user) {
      cartCount = await cartHelpers.getCartCount(user._id);
    }
    if(req.session.cartProds){
      res.render("users/checkout", {
        Name: req.session.user,
        products: req.session.cartProds,
        Total: req.session.subTotal,
        cartCount,
        address,
        wishCount: req.session.wishCount,
      });
    }else{
      res.redirect('/cart')
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.addAddress = (req, res, next) => {
  try {
    let userId = req.params.id;
    userHelpers.addAddress(userId, req.body);
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getEditAddress = async (req, res, next) => {
  try {
    let response = await userHelpers.getAddress(
      req.body.userId,
      req.body.addId
    );
    res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.applyCoupon = async (req, res, next) => {
  try {
    let response = await userHelpers.applyCoupon(
      req.body.couponName,
      req.body.userId
    );
    if (response.CouponName) {
      req.session.CouponName = response.CouponName;
    }
    res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.placeOrder = async (req, res, next) => {
  try {
    let products = await userHelpers.getCartProductList(req.body.userId);
    let totalPrice = await cartHelpers.getTotalAmount(req.body.userId);
    let couponName = req.session.CouponName;
    let orderData = await userHelpers.placeOrder(
      req.body,
      products,
      totalPrice,
      couponName
    );
    req.session.cart = null;
    req.session.orderAddr = req.body;
    req.session.orderData = orderData;
    if (req.body.Payment_method == "COD") {
      res.json({ codSuccess: true });
    } else {
      let response = await userHelpers.generateRazorpay(
        orderData.insertedId,
        totalPrice
      );

      res.json(response);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getSuccessPage = async (req, res, next) => {
  try {
    req.session.cartProds=null
      res.render("users/success-page", {
        Name: req.session.user,
        products: req.session.cartProds,
        Total: req.session.subTotal,
        cartCount: req.session.cart,
        wishCount: req.session.wishCount,
        order: req.session.orderData,
        Address: req.session.orderAddr,
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.verifyPayment = async (req, res, next) => {
  try {
    let response = await userHelpers.verifyPayment(req.body);
    let changePaymentStatus = await userHelpers.changePaymentStatus(
      req.body["order[receipt]"]
    );
    res.json({ status: true });
    console.log(req.body);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getViewOrders = async (req, res, next) => {
  try {
    let userId = req.params.id;
    let orders = await userHelpers.getOrderDetails(userId);
    let orderss = orders.reverse();
    req.session.orderDetails = orderss;
    res.render("users/view-orders", {
      Name: req.session.user,
      cartCount: req.session.cart,
      wishCount: req.session.wishCount,
      orders: req.session.orderDetails,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getSingleOrderDetails = async (req, res, next) => {
  try {
    let orderId = req.params.id;
    let orderAddress = await userHelpers.getsingleOrder(orderId);
    let orderDetails = await userHelpers.getSingleOrderDetails(orderId);
    res.render("users/single-order-details", {
      Name: req.session.user,
      cartCount: req.session.cart,
      wishCount: req.session.wishCount,
      orderDetails,
      orderAddress: orderAddress.deliveryDetails,
      order: orderAddress,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.editProfile = async (req, res, next) => {
  try {
    let userId = req.params.id;
    let edit = req.body;
    let editProfile = await userHelpers.editProfile(userId, edit);
    res.redirect("back");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getInvoice = async (req, res, next) => {
  try {
    let orderId = req.params.id;
    let orderAddress = await userHelpers.getsingleOrder(orderId);
    let orderDetails = await userHelpers.getSingleOrderDetails(orderId);
    res.render("users/invoice", {
      Name: req.session.user,
      cartCount: req.session.cart,
      wishCount: req.session.wishCount,
      orderDetails,
      orderAddress,
      order: orderAddress,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.addReview = async (req, res, next) => {
  try {
    await userHelpers.addReview(req.body)
  } catch (error) {
    console.log(error);
    next(error);
  }
};
