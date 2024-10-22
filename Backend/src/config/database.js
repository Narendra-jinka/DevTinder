const mongoose = require("mongoose");
const contectdb = async () => {
  await mongoose.connect(
    "mongodb+srv://DevTinderDB:backendDB@devtinderapp.8m1hw.mongodb.net/devTinder"
  );
};

module.exports = contectdb;