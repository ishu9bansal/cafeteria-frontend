import axios from "axios";
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

    useEffect(() => {
        axios.get('http://localhost:5050/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const onChangeRole = (userId, role) => {
        axios.put(`http://localhost:5050/users/${userId}`, { role })
            .then(response => {
                const user = response.data;
                const updatedUsers = users.map(u => u._id === user._id ? user : u);
                setUsers(updatedUsers);
            })
            .catch(error => console.error('Error editing user:', error));
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
