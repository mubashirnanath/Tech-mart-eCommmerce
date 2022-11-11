const { response } = require("express");
const express = require("express");
const router = express.Router();
const { single } = require("../multer/product");
const store = require("../multer/product");
const banner = require("../multer/banner");

const {
  adminLogin,
  adminPostLogin,
  adminDashboard,
  adminViewUsers,
  adminUserStatus,
  adminViewProducts,
  adminGetAddProducts,
  adminPostAddProducts,
  adminGetEditProduct,
  adminPostEditProduct,
  adminProductStatus,
  adminGetCategory,
  adminPostCategory,
  adminCategoryStatus,
  adminGetCoupon,
  adminPostCoupon,
  adminCouponStatus,
  adminGetAddBanner,
  adminPostAddBanner,
  adminViewOrders,
  adminViewOrderDetail,
  adminChangeDeliveryStatus,
  cancelOrder,
  getSalesReport,
  singleCatProucts,
  getBanner,
  bannerStatus,
  orderCount,
  getTotalRevenue,
  adminSignout
} = require("../controller/adminController");

// verifyAdmin
const verifyAdmin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin");
  }
};

//for adminLogin
router.route("/").get(adminLogin);
router.route("/sign-in").post(adminPostLogin);

//for dashboard
router.route("/dashboard").get(verifyAdmin, adminDashboard);
router.route("/order-count").post(orderCount);
router.route("/total-revenue").post(getTotalRevenue);
router.route("/sign-out").get(adminSignout);

// for users
router.route("/view-users").get(verifyAdmin, adminViewUsers);
router.route("/userStatus/:id").post(adminUserStatus);

// for products
router.route("/view-products").get(verifyAdmin, adminViewProducts);
router
  .route("/add-products")
  .get(verifyAdmin,adminGetAddProducts)
  .post(store.array("Image", 3), adminPostAddProducts);
router
  .route("/edit-product/:id")
  .get(verifyAdmin, adminGetEditProduct)
  .post(store.array("Image", 3),adminPostEditProduct);
router.route("/productStatus/:id").post(adminProductStatus);

// for category
router
  .route("/category")
  .get(verifyAdmin, adminGetCategory)
  .post(adminPostCategory);
router.route("/categoryStatus/:id").post(adminCategoryStatus);
router.route("/singlrCategoryProucts/:catName").get(verifyAdmin,singleCatProucts);

// for coupon
router.route("/coupon").get(verifyAdmin,adminGetCoupon).post(adminPostCoupon);
router.route("/coupon-status/:id").post(adminCouponStatus);

// for banner
router.route("/add-banner").get(verifyAdmin,adminGetAddBanner).post(banner.array("Image", 1),adminPostAddBanner)
router.route("/view-banner").get(verifyAdmin,getBanner);
router.route("/bannerStatus/:id").post(bannerStatus);

// for orders
router.route("/view-orders").get(verifyAdmin,adminViewOrders);
router.route("/view-order-detail/:id").get(verifyAdmin,adminViewOrderDetail);
router.route("/change-delivery-status/:id").post(adminChangeDeliveryStatus);
router.route("/cancel-order/:id").post(cancelOrder);

// for sales report
router.route("/sales-report").get(verifyAdmin,getSalesReport);

// admin error handling
router.use(function(req, res, next) {
  next(createError(404));
});

router.use(function (err, req, res, next) {
  console.log(err,"admin error route handler")
  res.status(err.status || 500);
  res.render('admin/admin-error');
});

module.exports = router;
