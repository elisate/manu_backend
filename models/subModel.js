import mongoose from "mongoose";

const subSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, 
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subSchema);
export default Subscription;
