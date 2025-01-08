const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../Middlewares/Auth");

requestRouter.post("/sendConnection", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent a connect request ");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = requestRouter;