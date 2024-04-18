const mongoose=require("mongoose")
const orderschema=new mongoose.Schema({
    products: [
        {
          type: mongoose.ObjectId,
          ref: "productmodel",
        },
      ],
      payment: {},
      buyer: {
        type: mongoose.ObjectId,
        ref: "usermodel",
      },
      status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
      },
    },
    { timestamps: true }
)
const ordermodel=mongoose.model("ordermodel",orderschema)
module.exports=ordermodel