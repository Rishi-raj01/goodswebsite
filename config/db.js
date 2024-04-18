const usermodel=require("../model/usermodel")
const mongoose = require("mongoose");
const db_link=  "mongodb+srv://rishirajjnvr448:Rishiraj2002@cluster1.sqbemgr.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster1";

// async function connectToDatabase() {
//     try {
//       await mongoose.connect(db_link);
//       console.log(`db connected `);
//       const fetched_data = await mongoose.connection.db.collection("usermodels").find({}).toArray();
//   console.log(fetched_data);
//     } catch (err) {
//       console.log("....", err);
//     }
//   }
async function connectToDatabase() {
  try {
    await mongoose.connect(db_link);
    console.log(`db connected`);

    // Fetch data using your Mongoose model
    const fetched_data = await usermodel.find({});
    console.log(fetched_data);
  } catch (err) {
    console.log("....", err);
  }
}
  
  connectToDatabase();
  
  module.exports = connectToDatabase;
  