import { useEffect, useState } from "react";
import placeHolderProfilePic from '../assets/profileImg.jpg'
import { ROLE } from "../constants";
import { useRetryApi } from "../hooks";

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
    const retryGetApi = useRetryApi('get');
    const retryPutApi = useRetryApi('put');
    const ROLES = Object.keys(ROLE);
    const [roleFilter, setRoleFilter] = useState();
    const filter = roleFilter ? `?role=${roleFilter}` : '';

    const fetchUsers = async () => {
        try {
            const usersArr = await retryGetApi('/users' + filter);
            setUsers(usersArr);
        }
        catch (err) {
            console.error('Error fetching users:', err)
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const onChangeRole = async (userId, role) => {
        try {
            const user = await retryPutApi(`/users/${userId}`, { role });
            const updatedUsers = users.map(u => u._id === user._id ? user : u);
            setUsers(updatedUsers);
        }
        catch (err) {
            console.error('Error editing users:', err)
        }
    };

    const handleFilterChange = (e) => {
        setRoleFilter(e.target.value || undefined);
    };

    return (
        <div className="users-page">
            <h1 className="page-title">Users</h1>
            <label>Filter by role: </label>
            <select onChange={handleFilterChange} value={roleFilter}>
                <option value={""}>All</option>
                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <div className="user-list">
                {users.map(user => (
                    <UserItem key={user._id} user={user} onRoleChange={onChangeRole} />
                ))}
            </div>
        </div>
    );
};
