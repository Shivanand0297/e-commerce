import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // comes by default in nodejs
import config from "../config";

// const userSchema = new mongoose.Schema({}) both are same now
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [30, "Name must be less then 30"],
    },
    email: {
      type: String,
      required: [true, "E-mail is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be 8 character long"],
      select: false, //whenever we are querying to the database this filed will not come
    },
    role: {
      type: String,
      // enum: ["ADMIN", "USER"]
      enum: Object.values(AuthRoles), // this will return the array of AuthRoles values ["ADMIN", "MODERATOR", "USER"]
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// challenge 1 - encrypt the password (we can do it in the same way we did in userAuth)
// here we will use mongoose hooks to encrypt the password before saving it
userSchema.pre("save", async function (next) { // use function not arrow function
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// challenge 2 -add more feature directly to schema so that we can use it directly when we need, just like save()mongoose method
userSchema.methods = {
  //it is like a prototype
  // compare password
  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  // generate jwt token
  getJwtToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        role: this.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRY, //process.env.JWT_EXPIRY
      }
    );
  },

  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20).toString("hex"); // generating random unique token string
    // step 1 - save unique string to db
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
    // step 2 - return values to user
    return forgotToken;
  },
};

export default mongoose.model("user", userSchema);
