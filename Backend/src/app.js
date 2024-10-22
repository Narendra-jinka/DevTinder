const express = require('express') ; 
const connectdb = require('./config/database');
const app =express();
const User = require('./models/user');

//middle ware to change the js objs to javascript objs

app.use(express.json()); // handles all the requests .. 

app.post("/signup", async (req,res)=>{
    const user = new User(req.body);
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