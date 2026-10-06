import React, { useState } from "react";
import { apiConnector } from "../../../../services/apiconnector";
import { categories } from "../../../../services/apis";

const Categories = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateCategory = async (e) => {
        e.preventDefault();

        if (!name || !description) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const response = await apiConnector(
                "POST",
                categories.CREATE_CATEGORY_API,
                {
                    name,
                    description,
                }
            );

            console.log("CREATE CATEGORY RESPONSE:", response);

            if (response?.data?.success) {
                alert("Category created successfully");
                setName("");
                setDescription("");
            }
        } catch (error) {
            console.log("CREATE CATEGORY ERROR:", error);
            alert(
                error?.response?.data?.message ||
                "Could not create category"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="text-richblack-5">
            <h1 className="text-3xl font-bold">
                Add Category
            </h1>

            <form
                onSubmit={handleCreateCategory}
                className="mt-8 max-w-[600px]"
            >
                <div className="mb-5">
                    <label className="mb-2 block text-sm text-richblack-100">
                        Category Name
                    </label>

                    <input
                        type="text"
                        placeholder="Enter category name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none"
                    />
                </div>

                <div className="mb-5">
                    <label className="mb-2 block text-sm text-richblack-100">
                        Description
                    </label>

                    <textarea
                        placeholder="Enter category description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="5"
                        className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 outline-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900"
                >
                    {loading ? "Creating..." : "Add Category"}
                </button>
            </form>
        </div>
    );
};

export default Categories;