const adminHelpers = require("../helpers/admin-helpers");
const productHelpers = require("../helpers/product-helpers");
const categoryHelpers = require("../helpers/category-helpers");
const bannerHelpers = require("../helpers/banner-helpers");
const store = require("../multer/product");
const userHelpers = require("../helpers/user-helpers");

var fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

exports.adminLogin = async (req, res, next) => {
  try {
    if (req.session.admin) {
      res.redirect("/admin/dashboard");
    }
    res.render("admin/sign-in", { logErr: req.flash("adminLogErr") });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminPostLogin = async (req, res, next) => {
  try {
    await adminHelpers.doLogin(req).then((response) => {
      if (response.status) {
        res.redirect("/admin/dashboard");
      } else {
        res.redirect("/admin");
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminDashboard = async (req, res, next) => {
  try {
    let hai = await adminHelpers.totalRevenue();
    let totalRevenue = hai.totalRevenue;
    let proCount = await productHelpers.getAllProducts();
    let orders = await adminHelpers.getAllOrders();
    let users = await adminHelpers.getAllUsers();
    res.render("admin/dashboard", { totalRevenue, proCount, orders, users });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminViewUsers = (req, res, next) => {
  try {
    adminHelpers.getAllUsers().then((users) => {
      res.render("admin/view-users", { users });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminUserStatus = (req, res, next) => {
  try {
    const userID = req.params.id;
    adminHelpers.userStatus(userID).then((response) => {
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminViewProducts = (req, res, next) => {
  try {
    productHelpers.getAllProducts().then((products) => {
      res.render("admin/view-products", { products });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminGetAddProducts = async (req, res, next) => {
  try {
    let detail = await categoryHelpers.viewCategory();
    res.render("admin/add-product", { category: detail });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminPostAddProducts = (req, res, next) => {
  try {
    const files = req.files;
    if (files) {
      const Images = [];
      for (i = 0; i < req.files.length; i++) {
        Images[i] = files[i].filename;
      }
      req.body.Image = Images;
      req.body.Price = parseInt(req.body.Price);
      req.body.Quantity = parseInt(req.body.Price);
      console.log(req.body);
      productHelpers.addProducts(req.body).then((id) => {
        res.redirect("/admin/add-products");
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminGetEditProduct = async (req, res, next) => {
  try {
    let categories = await categoryHelpers.viewCategory();
    let products = await productHelpers.getProductDetails(req.params.id);
    req.session.oldImagesofProduct = products.Image;
    res.render("admin/edit-product", {
      product: products,
      category: categories,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminPostEditProduct = async (req, res, next) => {
  try {
    const Images = [];
    for (i = 0; i < req.files.length; i++) {
      Images[i] = req.files[i].filename;
    }
    req.body.Image = Images;
    if (req.files.length > 0) {
      let oldImages = req.session.oldImagesofProduct;
      oldImages.forEach(async (Image) => {
        await unlinkAsync("public/product-images/" + Image);
      });
      let id = req.params.id;
      req.body.Price = parseInt(req.body.Price);
      req.body.Quantity = parseInt(req.body.Quantity);
      productHelpers.upadteProduct(id, req.body).then(() => {
        res.redirect("/admin/view-products");
      });
    } else {
      let id = req.params.id;
      req.body.Price = parseInt(req.body.Price);
      req.body.Quantity = parseInt(req.body.Quantity);
      productHelpers.upadteProduct1(id, req.body).then(() => {
        res.redirect("/admin/view-products");
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminProductStatus = (req, res, next) => {
  try {
    let proId = req.params.id;
    productHelpers.productStatus(proId).then((response) => {
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminGetCategory = async (req, res) => {
  try {
    let detail = await categoryHelpers.viewCategory();
    res.render("admin/category-page", { category: detail });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminPostCategory = async (req, res, next) => {
  try {
    await categoryHelpers.addCategory(req.body).then(() => {
      res.redirect("back");
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminCategoryStatus = (req, res, next) => {
  try {
    let catId = req.params.id;
    categoryHelpers.categoryStatus(catId).then((response) => {
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.singleCatProucts = async (req, res, next) => {
  try {
    let catName = req.params.catName;
    let catProds = await categoryHelpers.singleCatProucts(catName);
    res.render("admin/singleCatProucts", { catProds });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminGetCoupon = async (req, res, next) => {
  try {
    let coupons = await adminHelpers.getCoupon();
    res.render("admin/coupon", { Coupon: coupons });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminPostCoupon = async (req, res, next) => {
  try {
    await adminHelpers.addCoupon(req.body);
    res.redirect("back");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminCouponStatus = async (req, res, next) => {
  try {
    let couponId = req.params.id;
    adminHelpers.couponStatus(couponId).then((response) => {
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getBanner = async (req, res, next) => {
  try {
    let banner = await bannerHelpers.viewBanner();
    res.render("admin/view-banner", { banner });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminGetAddBanner = (req, res, next) => {
  try {
    res.render("admin/add-banner");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminPostAddBanner = (req, res, next) => {
  try {
    const file = req.files;
    req.body.Image = file[0].filename;
    bannerHelpers.addBanner(req.body).then((id) => {
      res.redirect("back");
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.bannerStatus = async (req, res, next) => {
  try {
    let banId = req.params.id;
    let response = await bannerHelpers.changeStatus(banId);
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminViewOrders = async (req, res, next) => {
  try {
    let orders = await adminHelpers.getAllOrders();
    res.render("admin/view-orders", { orders });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminViewOrderDetail = async (req, res, next) => {
  try {
    let orderId = req.params.id;
    let orderProds = await userHelpers.getSingleOrderDetails(orderId);
    let order = await userHelpers.getSingleOrder(orderId);
    res.render("admin/view-order-detail", { orderProds, order });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminChangeDeliveryStatus = (req, res, next) => {
  try {
    let orderId = req.params.id;
    let newStatus = req.body.status;
    adminHelpers.changeDeliveryStatus(orderId, newStatus);
    res.redirect("back");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.cancelOrder = (req, res, next) => {
  try {
    let orderId = req.params.id;
    adminHelpers.cancelOrder(orderId);
    res.json({ status: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getSalesReport = async (req, res, next) => {
  try {
    let report = await adminHelpers.salesReport();
    let hai = await adminHelpers.totalRevenue();
    let totalRevenue = hai.totalRevenue;
    res.render("admin/sales-report", { report, totalRevenue });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.orderCount = async (req, res, next) => {
  try {
    let response = await adminHelpers.ordersCount();
    res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.getTotalRevenue = async (req, res, next) => {
  try {
    let response = await adminHelpers.totalRevenueGraph();
    res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.adminSignout = async (req, res, next) => {
  try {
    req.session.admin = false;
    req.session.admin = null;
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
