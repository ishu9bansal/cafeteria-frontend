import { useEffect, useState } from "react";
import placeHolderProfilePic from '../assets/profileImg.jpg'
import { ROLE } from "../constants";

const UserItem = ({ user, onRoleChange }) => {
    const [selectedRole, setSelectedRole] = useState(user.role);

    const handleChange = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleSave = () => {
        if (selectedRole !== user.role) {
            onRoleChange(user._id, selectedRole);
        }
    };

    const ROLES = Object.keys(ROLE);

    return (
        <div className="user-card">
            <div className="user-profile-pic">
                <img
                    src={user.profilePic || placeHolderProfilePic}
                    alt={`${user.name}'s profile`}
                    className="profile-pic"
                />
            </div>
            <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
            </div>
            <div className="role-actions">
                <select
                    className="role-select"
                    value={selectedRole}
                    onChange={handleChange}
                >
                    {ROLES.map(role => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
                <button disabled={selectedRole === user.role} className="user-save-button" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
};

export const UsersPage = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const usersArr = await retryApi('get', `/users`);
            setUsers(usersArr);
        }
        catch (err) {
            console.error('Error fetching users:', err)
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onChangeRole = async (userId, role) => {
        try {
            const usersArr = await retryApi('get', `/users${userId}`, { role });
            const updatedUsers = usersArr.map(u => u._id === user._id ? user : u);
            setUsers(updatedUsers);
        }
        catch (err) {
            console.error('Error editing users:', err)
        }
    };

    return (
        <div className="users-page">
            <h1 className="page-title">Users</h1>
            <div className="user-list">
                {users.map(user => (
                    <UserItem key={user._id} user={user} onRoleChange={onChangeRole} />
                ))}
            </div>
        </div>
    );
};
