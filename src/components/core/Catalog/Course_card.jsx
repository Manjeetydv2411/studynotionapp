import React, { useEffect, useState } from "react";
import RatingStars from "../../Common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";
import { Link } from "react-router-dom";

const Course_Card = ({ course, Height }) => {
    console.log("COURSE CARD RECEIVED:", course);

    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(() => {
        if (course?.ratingAndReviews?.length) {
            const count = GetAvgRating(course.ratingAndReviews);
            setAvgReviewCount(count);
        } else {
            setAvgReviewCount(0);
        }
    }, [course]);

    return (
        <Link to={`/courses/${course._id}`}>
            <div className="rounded-xl">
                <div className="rounded-lg">
                    <img
                        src={course?.thumbnail}
                        alt="course thumbnail"
                        className={`${Height || "h-[250px]"} w-full rounded-xl object-cover`}
                    />
                </div>

                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-richblack-5">
                        {course?.courseName}
                    </p>

                    {/* Instructor */}
                    <p className="text-sm text-richblack-50">
                        {typeof course?.instructor === "object"
                            ? `${course?.instructor?.firstName || ""} ${
                                  course?.instructor?.lastName || ""
                              }`
                            : "Instructor"}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-5">
                            {avgReviewCount || 0}
                        </span>

                        <RatingStars Review_Count={avgReviewCount || 0} />

                        <span className="text-richblack-400">
                            {course?.ratingAndReviews?.length || 0} Ratings
                        </span>
                    </div>

                    {/* Price */}
                    <p className="text-xl text-richblack-5">
                        Rs. {course?.price}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default Course_Card;