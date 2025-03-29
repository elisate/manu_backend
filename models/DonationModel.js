import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    AmountDonated: {
      type: String,
      required: true,
    },
    Comment: {
      type: String,
      required: true,
    },  
    PhoneNum:{
        type:String,
        required:true
    },
   
    donorEmail:{
      type:String,
      required:false
  },

userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",  // Reference to the User model
  required: false,
},
ProjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",  // Reference to the User model
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to the User model
    required: false,
  },
status: {
  type: String,
  enum: ["Pending", "Approved", "Failed"], 
      default: "Pending",
},

  },
  
  {
    timestamps: true,
  }
);

const   Donation = mongoose.model("Donation", projectSchema);
export default Donation;
