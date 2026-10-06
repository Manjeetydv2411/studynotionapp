import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { Autoplay, FreeMode, Pagination } from "swiper/modules";

import Course_Card from "./Course_card";

const CourseSlider = ({ Courses }) => {
    console.log("COURSE SLIDER RECEIVED:", Courses);

    if (!Courses || Courses.length === 0) {
        return (
            <p className="text-xl text-richblack-5">
                No Course Found
            </p>
        );
    }

    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={Courses.length > 1}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            modules={[Autoplay, FreeMode, Pagination]}
            breakpoints={{
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            }}
            className="max-h-[30rem]"
        >
            {Courses.map((course) => (
                <SwiperSlide key={course._id}>
                    <Course_Card
                        course={course}
                        Height="h-[250px]"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default CourseSlider;