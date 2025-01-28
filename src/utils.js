import axios from "axios";

const BASE_URL = 'http://localhost:5050';
const AUTH_BASE_URL = 'http://localhost:5050/auth';

function axiosAuthConfig(method, url, body) {
    const token = localStorage.getItem('token');
    // const userId = localStorage.getItem('userId');
    return {
        method: method,
        url: url,
        data: body,
        headers: {
            Authorization: `Bearer ${token}`,
            // 'X-userId': userId,
        },
        baseURL: BASE_URL,
    };
}

export async function retryApi(method, url, body) {
    try {
        const response = await axios.request(axiosAuthConfig(method, url, body));
        return response.data;
    } catch (err) {
        const errorMessage = err?.response?.data?.message;
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
        const response = await axios.post(AUTH_BASE_URL + '/login', { email, password });
        const { token, refreshToken } = response.data;
        // localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    },
    token: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(AUTH_BASE_URL + '/token', null, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            }
        });
        const { token: newToken } = response.data;
        localStorage.setItem('token', newToken);
        return newToken;
    },
    register: async (name, email, password) => {
        const response = await axios.post(AUTH_BASE_URL + '/register', { name, email, password });
        return response.data;
    },
    logout: async () => {
        const response = await axios.request(axiosAuthConfig('delete', '/auth/logout'));
        console.log(response.data);
        // localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }
}

// TODO: write a general retry logic