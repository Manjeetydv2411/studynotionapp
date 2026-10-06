import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { catalogData } from "../apis";

export const getCatalogaPageData = async (categoryId) => {
    const toastId = toast.loading("Loading...");

    try {
        const response = await apiConnector(
            "POST",
            catalogData.CATALOGPAGEDATA_API,
            {
                categoryId: categoryId,
            }
        );

        console.log("CATEGORY PAGE FUNCTION RESPONSE:", response.data);

        if (!response?.data?.success) {
            throw new Error("Could not Fetch Category page data");
        }

        toast.dismiss(toastId);

        return response.data;

    } catch (error) {
        console.log("CATALOG PAGE DATA API ERROR:", error);

        toast.dismiss(toastId);
        toast.error(
            error?.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );

        return null;
    }
};