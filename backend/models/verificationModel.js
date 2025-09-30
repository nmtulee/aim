import mongoose from "mongoose";

const verificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);
const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;
// This code defines a Mongoose schema and model for a verification process.