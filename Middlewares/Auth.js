const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next)=>{
    try{
        const { token } = req.cookies;
        if(!token){
            throw new Error("Token not Valid !!!");
        }
        const decodedData = await jwt.verify(token,"@devTinder$098");
        const {_id} = decodedData;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("Invalid Credentials");
        }       
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
}

module.exports = {
    userAuth,
}