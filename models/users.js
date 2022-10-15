import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  dateAdded: { type: Date, default: Date.now },
  imageLink: { type: String },
  role: { type: String, enum: ["User", "Admin"], default: "User" },
});

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  //console.log("presave", this);
  next();
});

UserSchema.methods.validatePassword = async function(reqpassword) {
  const user = this;
  // const hashedPassword = user.password;
  return await bcrypt.compare(reqpassword, user.password);
};

const User = model("User", UserSchema);

export default User;
