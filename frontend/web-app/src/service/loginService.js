import axios from 'axios';

const apiBaseURL = 'http://localhost:8080/login';

export const login = async (loginData) => {
    try {
        const response = await axios.post(apiBaseURL, loginData);
        console.log("API response:", response);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (changeData) => {
    try {
        const response = await axios.put(`${apiBaseURL}/changePassword`, changeData); // Remove the extra double quote
        return response.data;
    } catch (error) {
        throw error;
    }
}

