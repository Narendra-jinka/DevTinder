const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "pending"],
        message: `Invalid status types : {VALUE}`,
      },
    },
  },
  {
    timestamps: true,
  }
);

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema
);

module.exports = ConnectionRequestModel;
