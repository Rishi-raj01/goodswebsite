const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const authrouter = require("./router/authrouter.js");
const categoryRouter=require("./router/categoryRouter.js")
const productrouter = require("./router/productRoute.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

const connectToDatabase = require('./config/db.js');

connectToDatabase();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
//app.use(cors());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

app.use("/user", authrouter);
app.use("/category",categoryRouter)
app.use("/product",productrouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
