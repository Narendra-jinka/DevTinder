const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");

const { userAuth } = require("../Middlewares/Auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("inValid Profile Edit request!!");
    }

    const loggedUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));

    await loggedUser.save();

    res.json({
      message: `${loggedUser.firstName},Profile Updated successful`,
      data: loggedUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password",userAuth, async(req,res)=>{
    try{
        const user = req.user;
        const {password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.send("password updated successfully");

    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

profileRouter.patch("/profile/password/:email", async(req,res)=>{
    try{
        const email = req.params.email;
        const { password} = req.body;
        if(!validator.isEmail(email)){
            throw new Error("invalid Email");
        }
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("Invalid credentials");
        }
        const hashedPassword = await bcrypt.hash(password,10);

        user.password = hashedPassword;
        await user.save();
        res.send("password update successful");

    }catch(err){
        res.status(400).send("ERROR : "+err.message);
    }
});

module.exports = profileRouter;
