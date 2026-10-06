const jwt=require("jsonwebtoken");
require("dotenv").config();
const user=require("../models/User");

//auth

exports.auth=async(req,res,next)=>{
    try{
        //extract token
       const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization")?.replace("Bearer ", "");


    // console.log("AUTH HEADER:", req.header("Authorization"));

        //if token missing return the response 
        if(!token){
            return res.status(401).json({
                success:false,
                message:'token is missing ', 
            })

        }
        //verify the token 
        try{
            const decode=await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;

        }catch(error){
            return res.status(401).json({
                success:false,
                message:"token is invalid ", 
            })

        }
        next();

    }catch(error){
        return res.status(401).json({
                success:false,
                message:"something went wrong  ",
             })

    }
}


//isStudent 
//  exports.isStudent=async(req,res,next)=>{
//     try{

//         if (req.user.accountType !== "student") {
//        return res.status (401).json({
//         success: false,
//         message: 'This is a protected route for Students only',
//     })
//     }
//     next();
// }catch(error){
//     return res.status(401).json({
//                 success:false,
//                 message:"role is  invalid ", 
//             }) 

//     }
//  }


exports.isStudent = async (req, res, next) => {
    try {
        console.log("IS STUDENT CHECK:", req.user.accountType);

        if (req.user.accountType !== "student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Students only",
            });
        }

        next();
    } catch (error) {
        console.log("IS STUDENT ERROR:", error);

        return res.status(401).json({
            success: false,
            message: "role is invalid",
        });
    }
};

 //isInstructor
 exports.isInstructor=async(req,res,next)=>{
    try{

        if (req.user.accountType !== "instructor") {
       return res.status (401).json({
        success: false,
        message: 'This is a protected route for Instructor only',
    })
    }
    next();
}catch(error){
    return res.status(401).json({
                success:false,
                message:"role is  invalid ", 
            }) 

    }
 }


 //isAdmin 
 exports.isAdmin=async(req,res,next)=>{
    try{

        if (req.user.accountType !== "admin") {
       return res.status (401).json({
        success: false,
        message: 'This is a protected route for  Admin only',
    })
    }
    next();
}catch(error){
    return res.status(401).json({
                success:false,
                message:"role is  invalid ", 
            }) 

    }
 }

 exports.isAdminOrInstructor = async (req, res, next) => {
    try {
        if (
            req.user.accountType !== "admin" &&
            req.user.accountType !== "instructor"
        ) {
            return res.status(401).json({
                success: false,
                message: "Only Admin or Instructor can access this route",
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Role is invalid",
        });
    }
};