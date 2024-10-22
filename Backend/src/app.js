const express = require('express') ; // importing from node_modules
const app =express();// using express instance to create server .. 


app.get("/user",(req,res,next)=>{
    
    // res.send({
    //     firstName:"Narendra",
    //     lastName : " jinka"
    // });
    console.log("get req123");
    
},(req,res)=>{
    
    res.send({
        firstName:"Narendra",
        lastName : " jinka"
    });
    console.log("get req123");
    
},);
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
});