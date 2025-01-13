import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
  },

  fullName: {
    type: String,
  },

  firstName: {
    type: String,
    minlength: 2,
  },
  lastName: {
    type: String,
    minlength: 2,
  },
  hobby: {
    type: String,
  },

  isAdmin: { type: Boolean }
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (this.isModified("password") || this.isNew) {
    try {
      user.password = await bcrypt.hash(
        user.password,
        +process.env.SALT_ROUNDS || 10
      );
    } catch (error) {
      return next(error);
    }
  }
  return next();
});

// compare two passwords:
userSchema.methods.comparePassword = async function (pw) {
  try {
    const isMatch = await bcrypt.compare(pw, this.password);
    if (isMatch === false)
      throw new Error("Please check your credentials and try again");
  } catch (error) {
    throw error;
  }
};

userSchema.set("timestamps", true);
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export const User = mongoose.model("User", userSchema);
