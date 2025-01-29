import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuthLogout } from "../hooks";

export const ProfilePage = () => {
    const user = useSelector(state => state.auth.user || {});
    const [loading, setLoading] = useState(false);
    const buttonText = loading ? 'Logging out..' : 'Logout';
    const logout = useAuthLogout();

    const handleLogout = async (e) => {
        setLoading(true);
        try {
            await logout();
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
