import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
  {
    title: {
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
        required:true
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

const   Project = mongoose.model("project", projectSchema);
export default Project;
