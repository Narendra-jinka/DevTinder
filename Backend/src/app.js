const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const {userAuth} = require("./Middlewares/Auth");
//middle ware to change the json objs to javascript objs
app.use(express.json()); // handles all the requests ..
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  
  try {
    const {firstName,lastName,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await new User({
        firstName,
        lastName,
        email,
        password:hashedPassword,
    });
    await user.save();
    res.send("Data added successfully!!");
  } catch (err) {
    res.status(400).send("error is occured :" + err.message);
  }
});

app.post("/login", async (req,res)=>{
    try {
      const {email,password} = req.body;
      
      if(!validator.isEmail(email)){
          throw new Error("Invalid Email ...!");
      }
     // console.log("validation success");

      const user =await User.findOne({email:email});
      if(!user){
        throw new Error("Invalid Credentials - email");
      }
      //console.log("data base user found.."+ user);
      const isPassword =await bcrypt.compare(password , user.password);
      //console.log(isPassword);
      if(isPassword){
        const token = await jwt.sign({_id: user._id} , "@devTinder$098",{expiresIn:'7d'});
        res.cookie("token",token);
        res.send("Login successfully");
      }
      else{
        res.send("Invalid Credentials - password")
      }  
    } catch (err) {
      res.status(400).send("Error :" + err.message);
    }
});
app.get("/profile",userAuth, async (req,res)=>{
    try{
      const user = req.user;
      res.send(user);
    }catch(err){
      res.status(400).send("ERROR: "+err.message);
    }
})

app.post("/sendConnection",userAuth,(req,res)=>{
  try{
    const user = req.user;
    res.send(user.firstName+" sent a connect request ");
  }catch(err){
    res.status(400).send("ERROR: "+err.message);
  }
})



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
