import axios from 'axios'
const apiBaseURL = 'http://localhost:8080/allProducts';

export const allProducts = async (productsData) => {
    try {
        const response = await axios.post(apiBaseURL, productsData);
        console.log("API response:", response);
        return response.data;
    } catch (error) {
        throw error;
    }
};
