const mongoose=require("mongoose");
// const subsection = require("./Subsection");

const sectionSchema= new mongoose.Schema({
   sectionName:{
    type:String,
   },
   subSection:[{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"SubSection",
   }]
    

   
    
})

module.exports =
  mongoose.models.Section || mongoose.model("Section", sectionSchema);