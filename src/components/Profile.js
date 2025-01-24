import { useSelector } from "react-redux";

export const ProfilePage = () => {
    const user = useSelector(state => state.auth.user || {});

    return <div>
        <h1>Profile</h1>
        <p><strong>Name: </strong>{user.name}</p>
        <p><strong>Email: </strong>{user.email}</p>
    </div>;
};
