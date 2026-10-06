import React, { useEffect, useState } from "react";
import { apiConnector } from "../../../../services/apiconnector";
import { categories, courseEndpoints } from "../../../../services/apis";

const AddCourse = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);

    const [whatYouWillLearn, setWhatYouWillLearn] = useState("");
    const [instructions, setInstructions] = useState("");

    const [categoryList, setCategoryList] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await apiConnector(
                "GET",
                categories.CATEGORIES_API
            );

            if (response?.data?.success) {
                setCategoryList(response.data.data);
            }
        } catch (error) {
            console.log("FETCH CATEGORIES ERROR:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
            console.log("IMAGE SELECTED:", file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !title ||
            !description ||
            !price ||
            !category ||
            !tag ||
            !image ||
            !whatYouWillLearn ||
            !instructions
        ) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("courseName", title);
            formData.append("courseDescription", description);
            formData.append("price", price);
            formData.append("category", category);

            formData.append(
                "tag",
                JSON.stringify([tag])
            );

            formData.append(
                "whatYouWillLearn",
                whatYouWillLearn
            );

            formData.append(
                "instructions",
                JSON.stringify([instructions])
            );

            formData.append("status", "Draft");

            formData.append(
                "thumbnailImage",
                image
            );

            console.log("CREATING COURSE...");

            const response = await apiConnector(
                "POST",
                courseEndpoints.CREATE_COURSE_API,
                formData
            );

            console.log("CREATE COURSE RESPONSE:", response);

            if (response?.data?.success) {
                alert("Course Created Successfully");

                setTitle("");
                setDescription("");
                setTag("");
                setPrice("");
                setCategory("");
                setImage(null);
                setWhatYouWillLearn("");
                setInstructions("");
            }
        } catch (error) {
            console.log("CREATE COURSE ERROR:", error);

            alert(
                error?.response?.data?.message ||
                "Failed to create course"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-richblack-5">

            <h1 className="text-3xl font-bold">
                Add Course
            </h1>

            <form
                onSubmit={handleSubmit}
                className="mt-8 max-w-[700px]"
            >

                {/* COURSE THUMBNAIL */}
                <div className="mb-6">

                    <label className="mb-2 block text-sm text-richblack-100">
                        Course Thumbnail
                    </label>

                    <label
                        htmlFor="course-thumbnail"
                        className="inline-block cursor-pointer rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900"
                    >
                        Upload Thumbnail
                    </label>

                    <input
                        id="course-thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    {image && (
                        <div className="mt-4">

                            <p className="text-sm text-green-400">
                                Selected: {image.name}
                            </p>

                            <img
                                src={URL.createObjectURL(image)}
                                alt="Course Thumbnail"
                                className="mt-3 h-40 w-64 rounded-lg object-cover"
                            />

                        </div>
                    )}

                </div>

                {/* COURSE TITLE */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm text-richblack-100">
                        Course Title
                    </label>

                    <input
                        type="text"
                        placeholder="Enter course title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none"
                    />

                </div>

                {/* COURSE DESCRIPTION */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm text-richblack-100">
                        Course Description
                    </label>

                    <textarea
                        placeholder="Enter course description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"
                        className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none"
                    />

                </div>

                {/* COURSE TAG */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm text-richblack-100">
                        Course Tag
                    </label>

                    <input
                        type="text"
                        placeholder="Enter course tag"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none"
                    />

                </div>

                {/* COURSE PRICE */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm text-richblack-100">
                        Course Price
                    </label>

                    <input
                        type="number"
                        placeholder="Enter course price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none"
                    />

                </div>

                {/* CATEGORY */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm text-richblack-100">
                        Category
                    </label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none"
                    >

                        <option value="">
                            Select a category
                        </option>

                        {categoryList.map((cat) => (
                            <option
                                key={cat._id}
                                value={cat._id}
                            >
                                {cat.name}
                            </option>
                        ))}

                    </select>

                </div>

                {/* WHAT YOU WILL LEARN */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm text-richblack-100">
                        Benefits / What You Will Learn
                    </label>

                    <textarea
                        placeholder="What will students learn from this course?"
                        value={whatYouWillLearn}
                        onChange={(e) =>
                            setWhatYouWillLearn(e.target.value)
                        }
                        rows="4"
                        className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none"
                    />

                </div>

                {/* INSTRUCTIONS */}
                <div className="mb-5">

                    <label className="mb-2 block text-sm text-richblack-100">
                        Requirements / Instructions
                    </label>

                    <textarea
                        placeholder="Enter course requirements or instructions"
                        value={instructions}
                        onChange={(e) =>
                            setInstructions(e.target.value)
                        }
                        rows="4"
                        className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none"
                    />

                </div>

                {/* CREATE COURSE */}
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900"
                >
                    {loading ? "Creating Course..." : "Create Course"}
                </button>

            </form>

        </div>
    );
};

export default AddCourse;