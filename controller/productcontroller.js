const productmodel = require("../model/productmodel");
const categorymodel=require("../model/CategoryModel")
const fs = require("fs");
const slugify = require("slugify");
var braintree = require("braintree");
const ordermodel=require("../model/ordermodel")

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "sbx93brp2ncgpfkn",
  publicKey: "3rd4ycjy4gygkjht",
  privateKey: "d13311816cc247f964785b7a66da030b",
});

module.exports.createProduct = async function createProduct(req, res) {
  try {
      console.log("create product working");
      const { name, description, price, category, quantity, shipping } = req.fields;
      console.log(req.fields);

      const { photo } = req.files;
      const product = new productmodel({ ...req.fields, slug: slugify(name) }); // Create a new product instance

      if (photo) {
          // Read the photo file and set it in the product model
          product.photo.data = fs.readFileSync(photo.path);
          product.photo.contentType = photo.type;
      }

      await product.save(); // Save the product to the database
      res.status(200).send({
          success: true,
          message: "Product Created Successfully",
          product, // Send the saved product in the response
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          error,
          message: "Error in creating product",
      });
  }
};
module.exports.getallproduct=async function getallproduct(req,res){
  try {
    console.log("get all product called from backend")

    let products=await productmodel.find().populate("category").select("-photo").limit(18).sort({createdAt:-1});              // -photo because hm nhi caahte ki hamari request ki size badi ho
    console.log("all product called found")
 console.log(products);
    if(products){
       return res.send({
        total:products.length,
        message:"all product retreived",
       data:products,  
              //not necessary to write "data" we can write anything here
            //  products
      })
    }
    else{
      console.log("nothing found")

      return res.status(400).send({
        message:"no products found"
      })
    }
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}
// module.exports.getproduct = async function getproduct(req, res) {
//   try {
//     console.log("getproduct caled")
//     let id=req.params.id;
//     console.log(" id from backend",id)
//    let product = await productmodel.findById(id).select("-photo").populate("category");


//     if (product) {
//       return res.status(200).send({
//         message: "product retrieved",
//         data: product
//       });
//     } else {
//       return res.status(400).send({
//         message: "no product found with given slug"
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: error.message
//     });
//   }
// };

module.exports.getproduct = async function getproduct(req, res) {
  try {
    console.log("getproduct caled")
    let slug=req.params.slug;
    console.log(" slug from backend",slug)
   let product = await productmodel.findOne({ slug: req.params.slug }).select("-photo").populate("category");


    if (product) {
      return res.status(200).send({
        message: "product retrieved",
        data: product
      });
    } else {
      return res.status(400).send({
        message: "no product found with given slug"
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
};

module.exports.getphoto=async function getphoto(req,res){
  try {
    let product=await productmodel.findById(req.params.pid).select("photo");
    if(product.photo.data){                                                        
    //  res.set("Content-type",product.photo.contentType)
    //   return res.status(200).send({
    //    image: product.photo.data}
    //  )
    res.set("Content-type", product.photo.contentType);
    return res.status(200).send(product.photo.data);
   }
   else{
     return res.status(400).send({
       message:"no photo found with given id "
     })
   }
  } catch (error) {
    res.status(500).send({
      message:error.message
    })
  }
}
module.exports.deleteproduct=async function deleteproduct(req,res){
  try {
    let product=await productmodel.findByIdAndDelete(req.params.id)
  if(product){
    return res.status(200).send({
      message:"product deleted successfully",
      data:product
    })
  }
  else{
    return res.status(400).send({
      message:"no product found with given id "
    })
  }
  } catch (error) {
     res.status(500).send({
      message:error.message
    })
  }
}

// module.exports.updateproduct = async function  updateproduct(req, res) {
//   try {
//     const { name, description, price, category, quantity, shipping } =
//       req.fields;
//     const { photo } = req.files;
// console.log("id is",req.params.id);
// console.log("req.feild is",req.feilds)
//     const products = await productModel.findByIdAndUpdate(
//       req.params.id,
//       { ...req.fields, slug: slugify(name) },
//       { new: true }
//     );
//     if (photo) {
//       products.photo.data = fs.readFileSync(photo.path);
//       products.photo.contentType = photo.type;
//     }
//     await products.save();
//     res.status(201).send({
//       success: true,
//       message: "Product Updated Successfully",
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Updte product",
//     });
//   }
// };



// module.exports.updateproduct = async function updateproduct(req, res) {
//   try {
//     console.log("update product running")
    
//       const { name, description, price, category, quantity, shipping } = req.fields;
//       console.log("request feilds are",req.fields)

//       const { photo } = req.files;
//       const productId = req.params.id;

//       const product = await ProductModel.findByIdAndUpdate(
//           productId,
//           { ...req.fields, slug: slugify(name) },
//           { new: true }
//       );

//       if (!product) {
//           return res.status(404).send({
//               success: false,
//               message: "Product not found",
//           });
//       }

//       if (photo) {
//           product.photo.data = fs.readFileSync(photo.path);
//           product.photo.contentType = photo.type;
//       }

//       await product.save();

//       res.status(200).send({
//           success: true,
//           message: "Product updated successfully",
//           product,
//       });
//   } catch (error) {
//       console.log(error);
//       res.status(500).send({
//           success: false,
//           error,
//           message: "Error in updating product",
//       });
//   }
// };

module.exports.updateproduct = async function updateproduct(req, res) {
  try {
    console.log("Received request body:", req.body);

    const fields = req.fields || {};
    const { name, description, price, category, quantity, shipping } = fields;
    const photo = req.files && req.files.photo;
    const productId = req.params.id;
    console.log("Received fields:", fields);
    console.log("Received photo:", photo);
    let product = await productmodel.findById(productId);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Existing product:", product);

    // Update product fields
    if (name) {
      console.log("Updating name to:", name);
      console.log("hello")
      console.log("product.data.name is ",product.name)
      product.name = name;
      product.slug = slugify(name);
    }
    if (description) {
      console.log("Updating description to:", description);
      product.description = description;
    }
    if (price) {
      console.log("Updating price to:", price);
      product.price = price;
    }
    // Continue updating other fields...

    // If photo is provided, update photo data
    if (photo) {
      console.log("Updating photo:", photo);
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    console.log("Updated product:", product);

    // Save the updated product
    await product.save();

    // Fetch the updated product from the database
    const updatedProduct = await productmodel.findById(productId);

    console.log("Fetched updated product:", updatedProduct);

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct, // Send the updated product back in the response
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in updating product",
    });
  }
};


module.exports.productFilterController = async function productFilterController(req, res) {
  try {
    console.log("filtercontroller is running");
   const{checked,radio}=req.body;
   let args={}
   if(checked.length>0) args.category=checked;  // If there are selected categories (i.e., checked.length > 0), it assigns the checked array to the category property of the args object.
   if(radio.length) args.price={$gte: radio[0], $lte: radio[1]}
   const products = await productmodel.find(args);

    res.status(200).json({
      success: true,
      products,
      message:"its working"
    });
  } catch (error) {
    console.error("Error while filtering products:", error);
    res.status(400).json({
      success: false,
      message: "Error while filtering products",
      error: error.message
    });
  }
};
module.exports.productcount=async function productcount(req,res){
  try {
    const total = await productmodel.find({}).estimatedDocumentCount();  //estimatedDocumentCount ye total number of product de dega
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
}

module.exports.productlist=async function productlist(req,res){
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productmodel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
}
module.exports.searchproduct=async function searchproduct(req,res){
  try {
    const { keyword } = req.params;
    const resutls = await productmodel.find({$or: [{ name: { $regex: keyword, $options: "i" } },{ description: { $regex: keyword, $options: "i" } },],
      }).select("-photo");        //search name aur descrioption dono ke basis pe karna hai uske liye $or []. query aise lagana h{name:{$regex:keyword.$opttions="i"}}  $options="i" isse pure ko lowercase me change kr dega 
 //{ name: { $regex: keyword, $options: "i" } }: This condition specifies that the name field of documents should match the regular expression defined by the keyword variable. The $regex operator is used for pattern matching, and $options: "i" ensures case-insensitive matching.
 
      res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
}

module.exports.relatedproduct=async function relatedproduct(req,res){
  try {
    const { pid, cid } = req.params;
    const products = await productmodel
      .find({
        category: cid,
        _id: { $ne: pid },       //$ne mtlb wo wali cheej include mat karo   $ne: This is a MongoDB operator that stands for "not equal to". It ensures that the product's _id is not equal to the specified pid
      })                  //.populate("category"): Populates the category field of the returned documents with actual category data. It fetches and replaces the category ID stored in each product document with the actual category data from the Category collection.
      .select("-photo")
      .limit(6)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
}
//get product by category
module.exports.productcategory = async function productcategory(req, res) {
  try {
    const category = await categorymodel.findOne({ slug: req.params.slug });
    console.log("its category from backend is is ", category);
    const products = await productmodel.find({ category }).populate("category");
    console.log("product found is ", products);
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};
//payment gateway api
module.exports.braintreeToken=async function braintreeToken(req,res){
try {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
} catch (error) {
  console.log(error);

}
}
module.exports.braintreepayment=async function braintreepayment(req,res){
  try {
    console.log("braintreepayment is working")
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new ordermodel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

