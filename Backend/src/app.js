const express = require('express') ; 
const connectdb = require('./config/database');
const app =express();
const User = require('./models/user');

app.post("/signup", async (req,res)=>{
    const user = new User({
        firstName: "Narendra",
        lastName :"Jinka",
        email : "narendrajinka44@gmail.com",
        password:"Nare@123",
        age : 24,
        gender : "male"
    });
    try{
        await user.save();
        res.send("Data added successfully!!"); 
    }catch(err){
        res.status(400).send("error is occured :", err.message);
    }
})


connectdb().then(()=>{
    console.log("database connected sucessfully");
    app.listen(3344,()=>{
        console.log("app listening at 3344 port ..") 
    });
}).catch(err=>{
    console.log("database connection failed ",err);
});