const express = require("express");
const requestRouter = express.Router();
const User = require("../models/User");

const { userAuth } = require("../Middlewares/Auth");
const ConnectionRequest = require("../models/ConnectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth,async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["ignored","interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message : "Invalid status Type"});
    }

    if(fromUserId == toUserId){
      return res.status(400).json({
        message : "you cannot send req to yourself",
      })
    }

    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(400).json({
        message : "Invalid User Request",
      })
    }

    const existingRequest =await ConnectionRequest.findOne({
      $or : [
        {fromUserId,toUserId},
        {fromUserId : toUserId, toUserId : fromUserId}
      ]
    });
    if(existingRequest){
      return res.status(400).json({
        message : "Req already Exists",
      })
    }

    const conReq = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })

    const data = await conReq.save();

    res.status(200).json({
      message : "Request sent : "+status,
      data
    });


    
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{
  try {
    const loggedInUser = req.user;
    const {status,requestId} = req.params;
    const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message : "Invalid Status Type"
      });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId : loggedInUser._id,
      status : "interested"
    });

    if(!connectionRequest){
      return res.status(400).json({
        message : " Invalid Request"
      })
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();
    res.status(200).json({
      message : "Request Reviewed : "+status,
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + err.message);
  }
});



module.exports = requestRouter;