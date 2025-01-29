import { useDispatch } from "react-redux";
import { authCall, REFRESH_TOKEN_ERROR, retryApi } from "./utils";
import { setUser } from "./slices/authSlice";
import { setCart } from "./slices/cartSlice";

export const useRetryApi = (method) => {
    const dispatch = useDispatch();
    const call = async (url, body) => {
        try {
            return await retryApi(method, url, body);
        } catch (err) {
            if (err.message === REFRESH_TOKEN_ERROR) {
                dispatch(setUser(null));    // remove user if failed to refresh access token
            }
            throw err;
        }
    };
    return call;
};

export const useAuthLogin = () => {
    const retryGetApi = useRetryApi('get');
    const dispatch = useDispatch();

    const fetchUser = async () => {
        try {
            const user = await retryGetApi('/cart');
            const cart = [...user.cart];
            delete (user.cart);
            dispatch(setUser(user));
            dispatch(setCart(cart));
        } catch (err) {
            console.error('Error fetching cart:', err);
            throw err;
        }
    };
    const login = async (email, password) => {
        await authCall.login(email, password);
        await fetchUser();
    };
    return login;
};

export const useAuthLogout = () => {
    const dispatch = useDispatch();
    const logout = async (e) => {
        await authCall.logout();
        dispatch(setUser(null));
    };
    return logout;
};