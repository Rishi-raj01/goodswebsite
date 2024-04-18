const usermodel=require("../model/usermodel");
const ordermodel=require("../model/ordermodel")
const { sendMail } = require('../utility/nodemailer');
//const { useAuth } =require("../client/src/context/auth");
const jwt=require("jsonwebtoken")
const jwt_key="hvvgdxrrdxffcygvvgc";
const SendmailTransport =require("nodemailer/lib/sendmail-transport")
const {hashPassword}=require("../helpers/authhelper")
//const [auth] = useAuth();
module.exports.signup = async function signup(req, res) {
    try {
        let dataobj = req.body;
        let user = await usermodel.create(dataobj);
        //sendMail("signup",user)
        
        if (user) {
            return res.send({
                message: 'user signed up ',
                data: user
            })
        }
        else {
            res.send({
                message: 'error while signing up ',
            })
        }
    }
    catch (err) {
        res.send({
            message: err.message
        })
    }
}


module.exports.login = async function login(req, res) {
    try {
        let data = req.body;
        console.log("email is ", req.body.email)
        if (data.email) {
            let user = await usermodel.findOne({ email: data.email });
            if (user) {
                if (user.password == data.password) {
                    let uid = user['_id'];
                    let token = jwt.sign({ payload: uid }, jwt_key);
                    
                    // Set the token cookie when the user logs in
                    res.cookie('login', token, { httpOnly: true });
                   
                    return res.send({
                        message: "user has logged in",
                        userDetails: {
                            id: user._id,
                            name: user.name,
                            address: user.location,
                            image: user.profileimage,
                            role: user.role,
                            email: user.email,
                            phone: user.phone
                        },
                        token: token,
                    });
                } else {
                    // Incorrect password
                    return res.status(401).send({
                        message: "Invalid login credential"
                    });
                }
            } else {
                // User not found
                return res.status(404).send({
                    message: "User not found"
                });
            }
        }
    } catch (err) {
        // Internal server error
        return res.status(500).send({
            message: err.message
        });
    }
};






// module.exports.userauth = (req, res) => {
//     res.status(200).send({ ok: true });   orrr
// }
module.exports.userauth = function userauth(req, res) {
    res.status(200).send({
        message: "user has logged in",
        ok:true,
        status:200
    
    });
}

// module.exports.forgetpassword = async function forgetpassword(req, res) {
//     try {
//         const emailv  = req.body.email;
//         console.log(req.body);
//         if (!emailv) {
//             return res.status(400)send({ message: 'Email is required' });
//         }

//         const user = await usermodel.findOne({ email: emailv });
//         if (!user) {
//             return res.status(404)send({ message: 'User not found. Please sign up.' });
//         }

//         // Generating token for sending link
//         const resettoken = user.createresettoken(); // Assuming you've defined this method in your user model

//         const resetpasswordlink = `${req.protocol}://${req.get('host')}/resetpassword/${resettoken}`;

//         // Send email to the user using nodemailer
//         const obj = {
//             resetpasswordlink,
//             email: emailv
//         };
//         // Assuming sendMail is defined somewhere and properly handles sending emails
//         sendMail('resetpassword', obj);

//         return ressend({ message: 'Reset password link sent to your email' });
//     } catch (err) {
//         console.error('Error in forgetpassword:', err);
//         return res.status(500)send({ message: 'Internal server error' });
//     }
// };
module.exports.forgetpassword = async function forgetpassword(req, res) {
    let data = req.body;
    try {
        const user = await usermodel.findOne({ email: data.email });
        if (user) {
            const token = await user.createresettoken();
            //await nhi kia to promise return krega 
        
            
            const resetpasswordlink = `${req.protocol}://${req.get('Host')}/user/resetpassword/${token}`;
            console.log(resetpasswordlink);
            
            console.log("Reset token from createresettoken should match with database:", user.resettoken);
            let obj = {
                resetpasswordlink: resetpasswordlink,
                email: data.email
            };
            sendMail('resetpassword', obj);
            return res.send({
                message: "Reset password link sent to your email"
            });
        } else {
            return res.send({
                message: "Please sign up"
            });
        }
    } catch (err) {
        ressend({
            message: err.message
        });
    }
};
module.exports.resetpassword = async function resetpassword(req, res) {
    try {
        
        const token = req.params.token; // Extract token from req.params
        console.log("Token:", token); // You can now access the token
        let { password, confirmpassword } = req.body;

        // Find the user by reset token
        const user = await usermodel.findOne({ resettoken: token });
        console.log("user is :",user)
        // Reset password if user found
        if (user) {
            user.resetpasswordhandler(password, confirmpassword);
            user.resettoken = undefined; // Clear reset token after password reset
            await user.save();
            res.send({
                message: "Password reset successfully. Please login again."
            });
        } else {
            res.send({
                message: "User not found"
            });
        }
    } catch (err) {
        res.send({
            message: err.message
        });
    }
};
// module.exports.protectroute= async function (req, res, next) {
//     try {
//         let token;
//        // let token=req.cookies.login;
//         //token verification: It checks if a login cookie exists in the request (req.cookies.login). If it does, it retrieves the token from the cookie and verifies it using jwt.verify() method with the provided jwt_key
//         if (req.cookies.login) {
            
//             let payload = jwt.verify(token, jwt_key);
//             console.log("payload is",payload)

//             if (payload) {
//                 // If the token is successfully verified, it extracts the user's ID from the token payload and retrieves the user from the database using usermodel.findById() .jwt jab bhi verified hota h to payload return krta h
//                 const user = await usermodel.findById(payload.payload);
//                 console.log("payload is ", payload.payload);
//                 //user set kr denge ye isliye kr rhe bcos pura ka pura user to nhi bhej sakte req ke andr so id bhej rhe h taaki getuserbyId wala fn usse access kr paaye jo ye profile frontend pe display kr de
//                // req.role = user.role;
//                 req.user = user; // Set user object directly on req
//                 req.id = user._id; // Set user ID directly on req
//                 console.log("id is ",req.id);
//                 next(); // Call next to proceed to the next middleware/route handler
//             } else {
//                 //browser
//                 console.log("payload is not found")

//               const client=req.get('user-Agent')
//               if(client.includes("Mozilla")==true){
//                 return res.send({
//                     message: 'user  verified'
//                 });
//                 //return because yha se aage ka code run nhi hone dena caahte 
//               }

                 
//                 //postman
//                 else{
//                 return res.send({
//                     message: 'user not verified'
//                 });
//             }
//             }
//         } else {
//             console.log("token is not found",token)

//             return res.send({
//                 message: 'operation not allowed'
//             });
//         }
//     } catch (err) {
//         return res.send({
//             message: err.message
//         });
//     }
// }
// module.exports.isauthorised = function isauthorised(role) {
//     return function(req, res, next) {
//         if (role.includes(req.role)) {
//            console.log("the role is :",req.role) //yha change krna padega dekho ki database se kya aa rha h 
//             next(); // If user role is authorized, proceed to the next middleware/route handler
//         } else {
//             res.status(403)send({
//                 message: "You are not allowed to access this content"
//             });
//         }
//     };
// };

// module.exports.isauthorised = function isauthorised(req,res,next) {
//     try {
//         localStorage.getItem("auth")
//         if(auth.role!=="admin"){
//             ressend({
//                 message: "you are not allowed to access this content",
//             })
//         }
//         else{
//             next()
//         }   
        
//     } catch (err) {
//         ressend({
//             message: err.message,
//         })
     
//     }
    
// };

// module.exports.protectroute = async function (req, res, next) {
//     try {
//         console.log("protectroute working");
        
//         // Check if Authorization header exists
//         if (!req.headers.authorization) {
//             throw new Error("Authorization header missing");
//         }

//         // Extract JWT token from Authorization header
//         const token = req.headers.authorization.split(" ")[1];

//         // Verify JWT token
//         const decode = jwt.verify(token, jwt_key);
//         req.user = decode;
//         console.log(req.user);
        
//         next();
//     } catch (error) {
//         console.error("Error in protectroute:", error);
//         return res.status(401)send({
//             success: false,
//             message: "Unauthorized Access",
//             error: error.message
//         });
//     }
// }

module.exports.protectroute = async function (req, res, next) {
    try {
      //  let token = req.cookies.login; // Extract token from cookies
      let token = req.headers.authorization
        console.log("token from protectroute is req.login.cookie ",token)
        // Token verification: Check if a login cookie exists in the request
        if (token) {
            // Verify the token using jwt.verify() method with the provided jwt_key
            let payload = jwt.verify(token, jwt_key);
            console.log("payload is", payload);
            if (payload) {
                // If the token is successfully verified, extract the user's ID from the token payload
                // Retrieve the user from the database using usermodel.findById()
                const user = await usermodel.findById(payload.payload);
                console.log("payload is ", payload.payload);
                
             
                // Set user object and ID directly on req
                req.user = user;
                req.id = user._id;
                req.token=token;
                console.log("id is ", req.id);
                next(); // Call next to proceed to the next middleware/route handler
            } else {
                // If payload is not found, handle accordingly
                console.log("payload is not found");
                const client = req.get('user-Agent');
                if (client.includes("Mozilla") == true) {
                    return res.send({
                        message: 'user verified'
                    });
                } else {
                    return res.send({
                        message: 'user not verified'
                    });
                }
            }
        } else {
            // If token is not found in cookies, handle accordingly
            console.log("token is not found", token);
            return res.send({
                message: 'operation not allowed'
            });
        }
    } catch (err) {
        // Handle any errors that occur during token verification
        return res.send({
            message: err.message
        });
    }
};





module.exports.isauthorised = async function isauthorised(req, res, next)  {
    try {
        //let id=req.id;
        let id=req._id;
        console.log("id is",id)
      //const user = await userModel.findById(req.user._id);
      const user = await usermodel.findById(id); // Access user ID directly from req

      if (user.role !== "admin") {
        return res.status(401).send({
          success: false,
          message: "UnAuthorized Access",
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({
        success: false,
        error,
        message: "Error in admin middelware",
      });
    }
  };



module.exports.adminauth = function adminauth(req, res) {
    res.status(200).send({
        message: "admin has logged in",
        ok:true,
        status:200
    });
}

module.exports.updateprofile=async function updateprofile(req,res){
    try {
        console.log("update profile code is running")
        const { name, email, password, address, phone } = req.body;
        console.log("the name is ",name)
        console.log("id of user is ",req.user._id)
        console.log("token   is ",req.token)

    const user = await usermodel.findById(req.user._id);
    console.log("the user is ",user)

    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await usermodel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
    } catch (error) {
        console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
    }
}
module.exports.getorders=async function getorders(req,res){
    try {
        const orders = await ordermodel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");
      res.json(orders);
    } catch (error) {
        console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
    }
}

module.exports.getallorders = async function getallorders(req, res) {
    try {
        const orders = await ordermodel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: -1 }); // Corrected sort field to createdAt
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Getting Orders",
            error,
        });
    }
}

//order status
module.exports.orderStatusController = async function orderStatusController(req, res)  {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const orders = await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }   //update kr rhe h so new ki property add krna padta hai 
      );
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Updateing Order",
        error,
      });
    }
  };