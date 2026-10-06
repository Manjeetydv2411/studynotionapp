const mongoose =require("mongoose");//mongoose ka config laa rhe hain

require('dotenv').config();//load kr diya 

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL
    
    )
    .then(()=>{
        console.log("db connect successfully");
    })
    .catch((error)=>{
        console.log("db connection has some issues ");
        console.error(error);
        process.exit(1);
    })
}