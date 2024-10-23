const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required : true,
    minLength: 3,
    maxLength:50,
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength:50,
  },
  email: {
    type: String,
    required: true,
    unique : true,
    lowercase : true,
    trim : true,
    
  },
  password: {
    type: String,
    required:true,
    minLength :8,
     
  },
  age: {
    type: Number,
    min : 18,
  },
  gender: {
    type: String,
    validate(value){
      if(!["male","female","others"].includes(value)){
        throw new Error("Gender is Invalid ..");
      }
    }
  },
  photoId:{
    type: String,
    default : ""
  },
  description :{
    type : String,
    default : "write your own description .. !! "
  },
  skills :{
    type : [String],
  },
},{
  timestamps : true
});

module.exports = mongoose.model("User", userSchema);
