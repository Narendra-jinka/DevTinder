const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../models/User");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("Data added successfully!!");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email ...!");
    }
    // console.log("validation success");

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials - email");
    }
    //console.log("data base user found.."+ user);
    const isPassword = await user.validatePassword(password);
    //console.log(isPassword);
    if (isPassword) {
      const token = await user.getJwt();
      res.cookie("token", token,{
        expires: new Date(Date.now() + 7 * 3600000),
      });
      res.send("Login successfully");
    } else {
      res.send("Invalid Credentials - password");
    }
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

authRouter.post("/logout", (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    })
    res.send("Logged out successfully!!");
});

module.exports = authRouter;
