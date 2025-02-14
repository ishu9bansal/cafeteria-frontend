import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const AUTH_BASE_URL = process.env.REACT_APP_AUTH_URL;

export const REFRESH_TOKEN_ERROR = 'refresh token failed';

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
    const apiCall = async () => {
        const response = await axios.request(axiosAuthConfig(method, url, body));
        return response.data;
    };

    const refreshToken = async () => {
        try {
            await authCall.token();
        } catch (err) {
            throw new Error(REFRESH_TOKEN_ERROR, { cause: err });
        }
    };

    return await retryLogic(apiCall, async (err) => {
        const errorMessage = err?.response?.data?.message;
        if (errorMessage !== 'jwt expired') {
            throw err;
        }
        await refreshToken();
    });
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

// this will retry the callback in case of error
// the error thrown from the callback will be passed to the errHandler method, which might throw error itself
// Incase handler throws an error it stops the retries, otherwise it will try the callbacks again
// Note: retries === 0 means there will be no error handling, retries === 1 means one extra time callback will be tried
const retryLogic = async (callback, errHandler, retries = 1) => {
    try {
        return await callback();
    } catch (err) {
        if (retries <= 0) {
            throw err;
        }
        await errHandler(err);
        return await retryLogic(callback, errHandler, --retries);
    }
}