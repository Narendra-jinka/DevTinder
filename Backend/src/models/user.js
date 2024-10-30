const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("InValid Email Id");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            " the password must contains min 8 chars and atleast 1Uppercase, 1Lowercase, 1Number, 1Special Char"
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is Invalid ..");
        }
      },
    },
    photoId: {
      type: String,
      default: "",
      validate(value) {
        if (validator.isURL(value)) {
          throw new Error("inValid Photo URL");
        }
      },
    },
    description: {
      type: String,
      default: "write your own description .. !! ",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("The Skills Must be less Then 10");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function(){
  const user =this;
  const token = await jwt.sign({_id: user._id} , "@devTinder$098",{expiresIn:'7d'});
  return token;
}

userSchema.methods.validatePassword = async function(inputPassword){
    const user = this;
    const password = user.password;
    const isPasswordValid = await bcrypt.compare(inputPassword,password);
    
    return isPasswordValid;



}

module.exports = mongoose.model("User", userSchema);
