const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    firstName:{
        type:"string",
        required:"true",
        trim:"true",
    },
    lastName:{
        type:"string",
        required:"true",
        trim:"true",

    },
    email:{
        type:"string",
        required:"true",
        trim:"true",
    
    },
    password:{
        type:"string",
        required:"true",
    },
    accountType:{
        type:String,
        enum:["admin","student","instructor"],
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Course",

    },
    image:{
        type:String,
        required:true,
    },
    courseProgress:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"courseProgress",

    }
})

module.exports=mongoose.model("User",userSchema);