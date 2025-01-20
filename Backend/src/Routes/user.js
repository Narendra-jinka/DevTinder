const express = require("express");
const userRoute = express.Router();
const { userAuth } = require("../Middlewares/Auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");
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

userRoute.get("/feed",userAuth,async(req,res)=>{
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10 ;
    limit  = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;

    const connectionRequests = await ConnectionRequest.find({
      $or : [
        {fromUserId :loggedInUser._id },{toUserId : loggedInUser._id}
      ]
    }).select("fromUserId toUserId");

    const hideProfiles = new Set();
    connectionRequests.forEach((conReq)=>{
      hideProfiles.add(conReq.fromUserId.toString());
      hideProfiles.add(conReq.toUserId.toString());
    });

    const data = await User.find({
      $and :[
        {_id : {$nin : Array.from(hideProfiles)}},
        {_id : {$ne : loggedInUser._id}}
      ]
    }).select(USER_ALLOWED_FIELDS).skip(skip).limit(limit);


    res.json({
      message:"Feed Fetched Successfully",
      data,
    })
  } catch (error) {
    res.status(400).send({
      message:error.message
    })
  }
});

module.exports = userRoute;
