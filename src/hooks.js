import { useDispatch } from "react-redux";
import { REFRESH_TOKEN_ERROR, retryApi } from "./utils";
import { setUser } from "./slices/authSlice";

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