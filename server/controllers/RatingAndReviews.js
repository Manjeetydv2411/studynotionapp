
const ratingAndreviews=require("../models/RatingAndReviews");
 const Course=require("../models/Course"); 
const RatingAndReviews = require("../models/RatingAndReviews");
const mongoose = require("mongoose");

 //create rating 
exports.createRating=async(req,res)=>{
    try{

        //get user id 
        const userId=req.user.id;

        //fetch data from req body
        const{rating,review,courseId}=req.body; 
        // check if user is enrolled 
        const courseDetails=await Course.findOne(

                                                 {_id:courseId,
                                                    studentsEnrolled:{$elemMatch:{$eq:userId}},
                                                 })

           if(!courseDetails){
            return res.status(404).json({
                  success:false,
                  message:'student is not enrolled in the course',
            })
           }                                      
        // check if user has already done reviews 
        const alreadyReviewed=await  RatingAndReviews.findOne({
                                                                user:userId,
                                                                 course:courseId,})
         
         if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:'already reviewed',
            })
         }

         //create review  
         const ratingReview=await RatingAndReviews.create({
                                            rating,
                                            review,
                                            course:courseId,
                                            user:userId, 
         } );

         //update course with this rating 
         
         await Course.findByIdAndUpdate( {_id:courseId}, {
                                           
                                               $push:{
                                                ratingAndReviews:ratingReview._id , 
                                               }
         },{new:true })

          //return response 
          return res.status(200).json({
            success:true,
            message:'rating and review created  successfully ',
            ratingAndreviews 
          })


    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
            
        })  

    }
}



 //get average rating 

 exports.getAverageRating =async(req,res)=>{
    try{
          //get courseId
          const courseId=req.body.CourseId;

          //calculate average rating 

          const result=await RatingAndReviews.aggregate( [{
            $match:{
                course:new mongoose.Types.ObjectId(courseId), 
            },},
            {$group:{
                _id:null, 
                averageRating:{$avg:"$rating"}, 
            }

            }
          ])
          //return rating

          if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating, 
            })
          }

          //if no rating given 
          return res.status(200).json({
            success:true,
            message:'avg rating is 0,no rating is given till now',
            averageRating:0,
          })
           
         

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
            
        })  

    }}




 //get all rating and review


 exports.getAllRating =async(req,res)=>{
    try{
          const allReviews=await RatingAndReviews.find({})
                                                          .sort({rating:-1})
                                                          .populate({  path:"user",
                                                            select:" firstName lastName email image  "
                                                          })
                                                          .populate({
                                                            path:"course",
                                                            select:"courseName",
                                                          }).exec();




                return res.status(200).json({
                    success:true,
                    message:"all reviews fetched successfully",
                    data:allReviews, 
                })
         

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
            
        })  

    }}



