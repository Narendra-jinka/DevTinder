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
    res.status(400).send("error is occured :" + err.message);
  }
});

// get a single user .  are list of user who are matched .
app.get("/users", async (req, res) => {
  const userEmail = req.body.email;
  console.log(userEmail);
  try {
    const users = await User.find({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("some thing went wrong");
  }
});

//get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("some thing went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const mail = req.body.email;

  try {
    const user = await User.findOneAndDelete({ email: mail });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("some thing went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const mail = req.body.email;
  const body = req.body;
  try {
    const user = await User.findOneAndUpdate({ email: mail }, body, {
      runValidators: true,
    });
    res.send("user updated successfully ");
  } catch (err) {
    res.status(400).send("some thing went wrong " + err.message);
  }
});
app.patch("/user/:email", async (req, res) => {
  const mail = req.params?.email;
  const body = req.body;
  try {
    const ALLOW_UPDATE = [
      "password",
      "firstName",
      "lastName",
      "age",
      "gender",
      "photoId",
      "description",
      "skills",
    ];
    const isAllowed = Object.keys(body).every((k) => ALLOW_UPDATE.includes(k));
    if (!isAllowed) {
      throw new Error("Update Not allowed");
    }
    const user = await User.findOneAndUpdate({ email: mail }, body, {
      runValidators: true,
    });
    res.send("user updated successfully ");
  } catch (err) {
    res.status(400).send("Update Failed:  " + err.message);
  }
});

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
