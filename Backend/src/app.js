const express = require('express') ; // importing from node_modules
const app =express();// using express instance to create server .. 
app.use("/test",(req,res)=>{
    res.send("hello this is server/test responding..");
    
});
app.use("/demo",(req,res)=>{
    res.send("hello this is server/demo123 responding..");
    
});
app.use("/",(req,res)=>{
    res.send("hello this is server/ responding..");
    
});
app.listen(3344,()=>{
    console.log("app listening at 3000 port ..") 
});