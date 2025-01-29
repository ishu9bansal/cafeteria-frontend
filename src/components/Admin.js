import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../slices/counterSlice";
import { useRetryApi } from "../hooks";

const StaticCounterCard = ({ counter, setEditing, handleDelete }) => {
    return (<div className="admin-counter-card">
        <h3>{counter.name}</h3>
        <p><strong>Merchants:</strong></p>
        <ul>
            {counter.merchants.map(merchant => (<li key={merchant._id}>
                {merchant.name} - {merchant.email}
            </li>))}
        </ul>
        <div className="button-group">
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
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

export const CounterCard = ({ counter, handleDelete, handleSave }) => {
    const [editing, setEditing] = useState(false);

    const onHandleSave = ({ name, merchants }) => {
        setEditing(false);
        handleSave({ _id: counter._id, name, merchants: merchants.map(m => m._id) });
    }

    return (editing
        ? <EditingCounterCard counter={counter} handleSave={onHandleSave} onCancel={() => setEditing(false)} />
        : <StaticCounterCard counter={counter} setEditing={setEditing} handleDelete={() => handleDelete(counter._id)} />
    );
};

export const CountersAdminView = ({ counters, fetchCounters }) => {
    const [counterName, setCounterName] = useState('');
    const dispatch = useDispatch();
    const retryGetApi = useRetryApi('get');
    const retryPostApi = useRetryApi('post');
    const retryPutApi = useRetryApi('put');
    const retryDeleteApi = useRetryApi('delete');

    const fetchUsers = async () => {
        try {
            const users = await retryGetApi('/users');
            dispatch(setUsers(users));
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const addCounter = async (name) => {
        try {
            await retryPostApi('/counters', { name });
            setCounterName("");
            fetchCounters();
        } catch (err) {
            console.error('Error adding counter:', err);
        }
    };

    const updateCounter = async (counter) => {
        try {
            await retryPutApi(`/counters/${counter._id}`, counter);
            fetchCounters();
        } catch (err) {
            console.error('Error updating counter:', err);
        }
    };

    const deleteCounter = async (counterId) => {
        try {
            await retryDeleteApi(`/counters/${counterId}`);
            fetchCounters();
        } catch (err) {
            console.error('Error deleting counter:', err);
        }
    };
    useEffect(() => {
        fetchCounters();
        fetchUsers();
    }, []);

    return (
        <div className="manage-counters">
            <input type="text" placeholder="Name of the new counter..." value={counterName} onChange={(e) => setCounterName(e.target.value)} />
            <button disabled={counterName.trim().length === 0} onClick={() => addCounter(counterName)}>
                Add New Counter
            </button>
            <div>
                {counters.map(counter => <CounterCard
                    key={counter._id}
                    counter={counter}
                    handleDelete={deleteCounter}
                    handleSave={updateCounter}
                />)}
            </div>
        </div>
    )
};