"use server";

export const getAllRestContries = async () => {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("API Request Error:", error);
        return null; // Handle errors gracefully
    }
};
