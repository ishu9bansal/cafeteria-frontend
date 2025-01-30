import { useEffect, useState } from "react";
import { useRetryApi } from "../hooks";
import { useNavigate } from "react-router-dom";

const StaticCounterCard = ({ counter, setEditing, handleDelete, loading }) => {
    const className = "admin-counter-card" + (loading ? " disabled" : "");
    return (<div className={className}>
        <h3>{counter.name}</h3>
        <p><strong>Merchants:</strong></p>
        <ul>
            {counter.merchants.map(merchant => (<li key={merchant._id}>
                {merchant.name} - {merchant.email}
            </li>))}
        </ul>
        <div className="button-group">
            <button disabled={loading} onClick={() => setEditing(true)}>Edit</button>
            <button disabled={loading} onClick={handleDelete}>Delete</button>
        </div>

    </div>);
};

const EditingCounterCard = ({ counter, handleSave, onCancel }) => {
    const [name, setName] = useState(counter.name);
    const [merchants, setMerchants] = useState(counter.merchants);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const retryGetApi = useRetryApi('get');
    const filteredUsers = results.filter(u => !merchants.map(m => m._id).includes(u._id));
    const handleDeleteUser = (merchantId) => {
        const updatedMerchants = merchants.filter(m => m._id !== merchantId);
        setMerchants(updatedMerchants);
    }
    const handleAddUser = (user) => {
        const updatedMerchants = [...merchants, user]
        setMerchants(updatedMerchants);
    }

    const fetchUsers = async (search) => {
        try {
            const searchResults = await retryGetApi(`/users?search=${search}`);
            setResults(searchResults);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (query.trim()) {
            fetchUsers(query.trim().toLowerCase());
        }
        return () => setResults([]);
    }, [query]);

    return (<div className="admin-counter-card">
        <h3><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></h3>
        <p><strong>Merchants:</strong></p>
        <ul>
            {merchants.map(merchant => (<li key={merchant._id}>
                <span>{merchant.name} - {merchant.email}</span><span className="remove-user" onClick={() => handleDeleteUser(merchant._id)}>X</span>
            </li>))}
        </ul>
        <input placeholder="Start typing to search for merchants" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        {filteredUsers.length > 0 && <div className="dropdown">
            {filteredUsers.map(user => (
                <div key={user._id} onClick={() => handleAddUser(user)}>
                    {user.name} - {user.email}
                </div>
            ))}
        </div>}
        <div className="button-group">
            <button onClick={() => handleSave({ name, merchants })}>Save</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    </div>);
};

export const AdminCounterCard = ({ counter, handleDelete, handleSave }) => {
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const onHandleSave = async ({ name, merchants }) => {
        setEditing(false);
        setLoading(true);
        try {
            await handleSave({ _id: counter._id, name, merchants: merchants.map(m => m._id) });
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    const onHandleDelete = async () => {
        setLoading(true);
        try {
            await handleDelete(counter._id);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (editing
        ? <EditingCounterCard counter={counter} handleSave={onHandleSave} onCancel={() => setEditing(false)} />
        : <StaticCounterCard counter={counter} setEditing={setEditing} handleDelete={onHandleDelete} loading={loading} />
    );
};

export const CounterCard = ({ counter }) => {
    const navigate = useNavigate();
    const onClick = () => {
        navigate(`/counter/${counter._id}`);
    };
    return (
        <div className="counter-card" onClick={onClick}>
            <h3>{counter.name}</h3>
            <p>{counter.name}</p>
        </div>
    );
};
