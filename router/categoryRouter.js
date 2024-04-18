const express=require("express");
const { isauthorised,protectroute } = require("../controller/authcontroller");
const{createCategory,updateCategory,deleteCategory,getallcategory, getcategory}=require("../controller/Categorycontroller")
const categoryRouter=express.Router();

categoryRouter.route("/allcategory")
.get(getallcategory)
categoryRouter.route("/single-category/:slug")
.get(getcategory)
//categoryRouter.use(protectroute);
//categoryRouter.use(isauthorised);
categoryRouter.route("/create-category")
.post(createCategory)

categoryRouter.route("/crud-category/:id")
.patch(updateCategory)
.delete(deleteCategory)

module.exports=categoryRouter