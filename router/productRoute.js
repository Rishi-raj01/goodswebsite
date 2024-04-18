const express = require("express");
const fs = require("fs");
const { protectroute, isauthorised } = require("../controller/authcontroller");
const { createProduct,getallproduct,getproduct,getphoto,deleteproduct,updateproduct,productFilterController, productcount, productlist, searchproduct, relatedproduct, productcategory, braintreeToken, braintreepayment } = require("../controller/productcontroller");
const formidable = require("express-formidable");
const productrouter = express.Router();

// Middleware for protecting route and checking authorization
productrouter.route("/get-product")
.get(getallproduct)
productrouter.route("/get-product/:slug")          //yha pe slug use kia h usne itska matter done
.get(getproduct)
productrouter.route("/get-photo/:pid")
.get(getphoto)
//productrouter.use(protectroute);
//productrouter.use(isauthorised);


productrouter.route("/create-product")
.post(formidable(), createProduct);
productrouter.route("/delete-product/:id")
.delete(deleteproduct)
//.patch(updateproduct) 

productrouter.route("/update-product/:id")       //yha tak done hai
.put( formidable(),updateproduct)
//filter product
productrouter.route("/product-filters")
.post(productFilterController); 
//count product
productrouter.route("/product-count")
.get(productcount)

//product per page
productrouter.route("/product-list/:page")
.get(productlist)

//search
productrouter.route("/search/:keyword")
.get(searchproduct)
//similar product
productrouter.route("/related-product/:pid/:cid")
.get(relatedproduct)
//category wise product
productrouter.route("/product-category/:slug")   //yha bhi slug
.get(productcategory)
//payment route
//token
productrouter.route("/braintree/token")
.get(braintreeToken)

//payments
productrouter.route("/braintree/payment")
.post(protectroute,braintreepayment)

module.exports = productrouter;
