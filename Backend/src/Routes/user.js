const express = require("express");
const userRoute = express.Router();
const { userAuth } = require("../Middlewares/Auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const USER_ALLOWED_FIELDS =
  "firstName lastName age about skills photoId gender";

userRoute.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_ALLOWED_FIELDS);

    res.status(200).json({
      message: "Request Fetch Successfully",
      connectionRequests,
    });
  } catch (error) {
    res.status(404).send("Error : " + error);
  }
});

userRoute.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_ALLOWED_FIELDS)
      .populate("toUserId", USER_ALLOWED_FIELDS);
    
    const data = connectionRequests.map((conReq) => {
      if (conReq.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return conReq.toUserId;
      }
      return conReq.fromUserId;
    });

    res.status(200).json({
      message: "Connections Fetch Successfully",
      data,
    });
  } catch (error) {}
});

module.exports = userRoute;
