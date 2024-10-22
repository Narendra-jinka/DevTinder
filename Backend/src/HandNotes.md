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
app.post("/user",(req,res)=>{
    res.send("Data Posted successfully ");
});

app.delete("/user" , (req,res)=>{
    res.send("Data deleted successfully ")
})

app.use("/test",(req,res)=>{
    res.send("hello this is server/test responding..");
    
});


app.listen(3344,()=>{
    console.log("app listening at 3000 port ..") 
}); -->


 
 app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong..!");
    }
});

here in the above handler , no of args are matters . 

2 args -> 1) req , 2) res ;
3 args -> 1) req , 2) res , 3) next();
4 args -> 1) err , 2) req , 3) res , 4) next() ;

but better to use try-catch