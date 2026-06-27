// const express = require("express");
// const connectDB = require("./config/database");

// const app = express();

// connectDB();

// app.listen(3000, () => {
//   console.log("Server chạy tại http://localhost:3000");
// });


const express = require("express");
require("dotenv").config(); 


const connectDB = require("./config/database");

const app = express();
const port = process.env.PORT || 3000; 


app.use(express.json());


connectDB();

// Khởi động server
app.listen(port, () => {
  console.log(` Server đang chạy tại http://localhost:${port}`);
});