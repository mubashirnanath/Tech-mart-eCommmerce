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


// verify user
const verifyUser = async (req, res, next) => {
  if (req.session.loggedIn) {
    let userId = req.session.user._id;
    let user = await userHelpers.getUserDetails(userId);
    console.log(user);
    if (user.Active) {
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

// for home
router.route("/").get(getHome);

// for sign in
router.route("/sign-in").get(getLogin).post(postLogin);

// for sign up
router.route("/sign-up").get(getRegister).post(postRegister);
router.route("/verify-otp").get(getOtp).post(postOtp);

router.route("/sign-out").post(postLogout);
// for product page
router.route("/product").get(getProduct);

// for product detail page
router.route("/product-detail/:id/:catName").get(getProductDetails);

// for contact page
router.route("/contact").get(getcontactPage);

// for contact page
router.route("/profile").get(verifyUser,getProfile);
router.route("/edit-profile/:id").post(editProfile);

// for cart
router.route("/cart").get(verifyUser, getCart);
router.route("/add-to-cart/:id").get(getCartItems);
router.route("/change-product-quantity").post(changeProductQuantity);
router.route("/delete-cart-product/:cartId/:proId").delete(deleteCartProduct);

// for wishlist
router.route("/wish-list").get(verifyUser, getWishListProducts);
router.route("/add-to-wishlist/:id").post(verifyUser, addToWishList);
router.route("/delete-wish-product/:wishId/:proId").get(deleteWishProduct);

// for checkout
router.route("/checkout-page").get(verifyUser,getCheckout)
router.route("/apply-coupon").post(applyCoupon);
router.route("/place-order").post(placeOrder);
router.route("/verify-payment").post(verifyPayment);

// for profile
router.route("/add-address/:id").post(addAddress);
router.route("/get-edit-address").post(getEditAddress);

// for success page
router.route("/success-page").get(verifyUser,getSuccessPage);

// for order page
router.route("/view-orders/:id").get(verifyUser,getViewOrders);

// for single order details
router.route("/single-order-details/:id").get(verifyUser,getSingleOrderDetails);

// for invoice
router.route("/invoice/:id").get(verifyUser,getInvoice);

// for review
router.route("/add-review").post(addReview);

module.exports = router;
