const { response } = require("express");
const express = require("express");
const router = express.Router();
const userHelpers = require("../helpers/user-helpers");
const {
  getHome,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getOtp,
  postOtp,
  getProductDetails,
  getProduct,
  postLogout,
  getProfile,
  getCartItems,
  getCart,
  changeProductQuantity,
  deleteCartProduct,
  addToWishList,
  getWishListProducts,
  deleteWishProduct,
  getCheckout,
  addAddress,
  getEditAddress,
  applyCoupon,
  placeOrder,
  getSuccessPage,
  verifyPayment,
  getViewOrders,
  getSingleOrderDetails,
  editProfile,
  getcontactPage,
  getInvoice,
  addReview
} = require("../controller/UserController");


//VERIFY LOGIN
const verifyUser = async (req, res, next) => {
  if (req.session.loggedIn) {
    console.log(req.session.user);
    let userId = req.session.user._id;
    let user = await userHelpers.getUserDetails(userId);
    console.log(user);
    if (user.Active) {
      console.log("hello");
      next();
    } else {
      req.session.loggedIn = false;
      req.session.user = null;
      req.session.cart = null;
      res.redirect("/sign-in");
    }
  } else {
    res.redirect("/sign-in");
  }
};

// HOME PAGE
router.route("/").get(getHome);

// SIGN-IN PAGE
router.route("/sign-in").get(getLogin).post(postLogin);

// SIGN-UP PAGE
router.route("/sign-up").get(getRegister).post(postRegister);

router.route("/verify-otp").get(getOtp).post(postOtp);

router.route("/sign-out").post(postLogout);

router.route("/product").get(getProduct);

router.route("/product-detail/:id/:catName").get(getProductDetails);

router.route("/contact").get(getcontactPage);

router.route("/profile").get(verifyUser,getProfile);

router.route("/edit-profile/:id").post(editProfile);

router.route("/cart").get(verifyUser, getCart);

router.route("/add-to-cart/:id").get(getCartItems);

router.route("/change-product-quantity").post(changeProductQuantity);

router.route("/delete-cart-product/:cartId/:proId").delete(deleteCartProduct);

router.route("/add-to-wishlist/:id").post(verifyUser, addToWishList);

router.route("/wish-list").get(verifyUser, getWishListProducts);

router.route("/delete-wish-product/:wishId/:proId").get(deleteWishProduct);

router.route("/checkout-page").get(verifyUser,getCheckout)

router.route("/add-address/:id").post(addAddress);

router.route("/get-edit-address").post(getEditAddress);

router.route("/apply-coupon").post(applyCoupon);

router.route("/place-order").post(placeOrder);

router.route("/success-page").get(verifyUser,getSuccessPage);

router.route("/verify-payment").post(verifyPayment);

router.route("/view-orders/:id").get(verifyUser,getViewOrders);

router.route("/single-order-details/:id").get(verifyUser,getSingleOrderDetails);

router.route("/invoice/:id").get(verifyUser,getInvoice);

router.route("/add-review").post(addReview);



module.exports = router;
