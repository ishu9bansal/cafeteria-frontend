import axios from "axios";

const BASE_URL = 'http://localhost:5050';
const AUTH_BASE_URL = 'http://localhost:5050/auth';

function axiosAuthConfig(method, url, body) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return {
        method: method,
        url: url,
        data: body,
        headers: {
            Authorization: `Bearer ${token}`,
            'X-userId': userId,
        },
        baseUrl: BASE_URL,
    };
}

export async function retryApi(method, url, body) {
    try {
        const response = await axios.request(axiosAuthConfig(method, url, body));
        return response.data;
    } catch (err) {
        const errorMessage = err?.response?.data?.error;
        if (errorMessage !== 'jwt expired') {
            throw err;
        }
        await authCall.token();
        const response = await axios.request(axiosAuthConfig(method, url, body));
        return response.data;
    }
}

export const authCall = {
    login: async (email, password) => {
        const response = await axios.post('http://localhost:5050/auth/login', { email, password });
        const { token, refreshToken, userId } = response.data;
        localStorage.setItem('userId', userId);
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

// TODO: write a general retry logic