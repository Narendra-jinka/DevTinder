const express = require("express");
const connectdb = require("./config/database");
const app = express();
const User = require("./models/user");

//middle ware to change the js objs to javascript objs
app.use(express.json()); // handles all the requests ..

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("Data added successfully!!");
  } catch (err) {
    res.status(400).send("error is occured :", err.message);
  }
});

app.get("/users", async (req, res) => {
    const userEmail = req.body.email;
    console.log(userEmail);
  try {
    const users = await User.find({ email:  userEmail});
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("some thing went wrong");
  }
});

app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("some thing went wrong");
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
