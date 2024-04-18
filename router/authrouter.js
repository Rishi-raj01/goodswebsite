const express=require("express")
const authrouter=express.Router();
const{signup,login,protectroute,isauthorised,userauth,forgetpassword,resetpassword,adminauth, updateprofile, getorders, getallorders, orderStatusController}=require("../controller/authcontroller");

//const { isAdmin } = require("../helpers/authhelper");

authrouter.route("/signup")
.post(signup)
authrouter.route("/login")
.post(login)
authrouter.route("/forgetpassword")
.post(forgetpassword)
authrouter.route("/resetpassword/:token")
.post(resetpassword)
// authrouter.use(protectroute);
// authrouter.get("/userauth", userauth);

//authrouter.use(protectroute);
authrouter.route("/userauth")
.get(protectroute,userauth);

//router.put("/profile", requireSignIn, updateprofile);
authrouter.route("/profile")
.put(protectroute,updateprofile)



authrouter.route("/orders")
.get(protectroute,getorders)
authrouter.route("/all-orders")
.get(protectroute,getallorders)

// order status update
authrouter.route( "/order-status/:orderId")
.put(protectroute,adminauth,orderStatusController);   //isauthorised in place of adminauth
  





// authrouter.route("/userauth")
// .get(protectroute, userauth);

//authrouter.use(isauthorised)      ISKO RAKHNE PE PROBLEM HO RHI H  USE adminauth INSTEAD
authrouter.route("/adminauth")
.get(adminauth);

module.exports=authrouter

