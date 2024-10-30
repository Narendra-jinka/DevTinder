const express = require("express");
const connectdb = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();
//middle ware to change the json objs to javascript objs
app.use(express.json()); // handles all the requests ..
app.use(cookieParser());

const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


connectdb()
  .then(() => {
    console.log("database connected sucessfully");
    app.listen(3344, () => {
      console.log("app listening at 3344 port ..");
    });
  })
  .catch((err) => {
    console.log("database connection failed ", err);
  });
