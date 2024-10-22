const express = require('express') ; // importing from node_modules
const app =express();// using express instance to create server .. 
const {adminAuth} = require("./Middlewares/Auth")

app.get("/user",adminAuth,(req,res,next)=>{
    
    res.send({
        firstName:"Narendra",
        lastName : " jinka"
    });
    
    console.log("get req123");
    
});

 
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong..!");
    }
});


app.listen(3344,()=>{
    console.log("app listening at 3344 port ..") 
});