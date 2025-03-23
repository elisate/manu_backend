import mongoose from "mongoose";
const marketSchema = mongoose.Schema(
  {
    itemName:{
      type: String,
      required: true,
    },
    itemPrice:{
      type: String,
      required: true,
    },
    itemDeliveryStatus:{
      type: String,
      required: true,
      enum:["Delivery", "Installation"]
    },
    companyOwner:{
      type: String,
      required: true,
    },
    images: {
      type:Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },  
    posterName:{
        type:String,
        required:false
    },
    location:{
        type:String,
        required:true   
    },
    contact:{
        type:String,
        required:true
    },
    itemCondition:{
        type:String,
        required:true
    }
  },
  {
    timestamps: true,
  }
);

const   Market = mongoose.model("markets", marketSchema);
export default Market;
