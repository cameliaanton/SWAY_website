import axios from 'axios';
const apiBaseURL = 'http://localhost:8080/admin'

export const addProduct = async (productData) => {
    try {
        const response = await axios.post(`${apiBaseURL}/addProduct`, productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};