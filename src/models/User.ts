import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
