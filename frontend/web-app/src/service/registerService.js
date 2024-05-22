import axios from 'axios';
const apiBaseURL = 'http://localhost:8080/register'

export const register = async (registerData) => {
    return axios.post(`${apiBaseURL}`, registerData);
};