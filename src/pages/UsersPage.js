import { useEffect, useState } from "react";
import { ROLE } from "../constants";
import { useRetryApi } from "../hooks";
import { UserItem } from "../components/User";

export const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const retryGetApi = useRetryApi('get');
    const retryPutApi = useRetryApi('put');
    const ROLES = Object.keys(ROLE);
    const [roleFilter, setRoleFilter] = useState();
    const filter = roleFilter ? `?role=${roleFilter}` : '';

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const usersArr = await retryGetApi('/users' + filter);
            setUsers(usersArr);
        }
        catch (err) {
            console.error('Error fetching users:', err)
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
        return () => setUsers([]);
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
            {loading && <h1>Loading...</h1>}
            <div className="user-list">
                {users.map(user => (
                    <UserItem key={user._id} user={user} onRoleChange={onChangeRole} />
                ))}
            </div>
        </div>
    );
};
