const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    birthdate: { type: Date, required: false },
    phone: { type: String, required: false },
    plan: { type: String, required: false },
    location: { type: String, required: false },
    gender: { type: String, required: false },
    age: { type: Number, required: false },
    distance: { type: Number, required: false },
    verified: { type: Boolean, required: false, default: false },
    codeOtp: {type: Number, required: false},
    favsport: {type: String, required:false}
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
