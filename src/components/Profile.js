import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authCall } from "../utils";
import { setUser } from "../slices/authSlice";

export const ProfilePage = () => {
    const user = useSelector(state => state.auth.user || {});
    const [loading, setLoading] = useState(false);
    const buttonText = loading ? 'Logging out..' : 'Logout';
    const dispatch = useDispatch();

    const handleLogout = async (e) => {
        setLoading(true);
        try {
            await authCall.logout();
            dispatch(setUser(null));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return <div>
        <h1>Profile</h1>
        <p><strong>Name: </strong>{user.name}</p>
        <p><strong>Email: </strong>{user.email}</p>
        <button disabled={loading} onClick={handleLogout} className="submit-button">{buttonText}</button>
    </div>;
};
