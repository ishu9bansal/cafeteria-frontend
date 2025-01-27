import axios from "axios";

const BASE_URL = 'http://localhost:5050';
const AUTH_BASE_URL = 'http://localhost:5050/auth';

function axiosAuthConfig(token, method, url, body) {
    return {
        method: method,
        url: url,
        data: body,
        headers: {
            Authorization: `Bearer ${token}`
        },
        baseUrl: BASE_URL,
    };
}

export async function retryApi(method, url, body) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.request(axiosAuthConfig(token, method, url, body));
        return response.data;
    } catch (err) {
        const errorMessage = err?.response?.data?.error;
        if (errorMessage !== 'jwt expired') {
            throw err;
        }
        const newToken = await authCall.token();
        const response = await axios.request(axiosAuthConfig(newToken, method, url, body));
        return response.data;
    }
}

export const authCall = {
    login: async (email, password) => {
        const response = await axios.post('http://localhost:5050/auth/login', { email, password });
        const { token, refreshToken } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    },
    token: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(AUTH_BASE_URL + '/token', { token: refreshToken });
        const { token: newToken } = response.data;
        localStorage.setItem('token', newToken);
        return newToken;
    },
    register: async (name, email, password) => {
        await axios.post('http://localhost:5050/auth/register', { name, email, password });
    },
}