import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../slices/counterSlice";

const StaticCounterCard = ({ counter, setEditing, handleDelete }) => {
    return (<div className="admin-counter-card">
        <h3>{counter.name}</h3>
        <p><strong>Merchants:</strong></p>
        <ul>
            {counter.merchants.map(merchant => (<li>
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
    // TODO: fix search results selector, only merchants, don't show already included
    // TODO: move the state to admin slice
    const users = useSelector(state => state.counter.users.filter(u => u.name.toLowerCase().includes(query.toLowerCase())));
    const showDropdown = query.length >= 3;
    const handleDeleteUser = (merchantId) => {
        const updatedMerchants = merchants.filter(m => m._id !== merchantId);
        setMerchants(updatedMerchants);
    }
    const handleAddUser = (user) => {
        const updatedMerchants = [...merchants, user]
        setMerchants(updatedMerchants);
    }

    return (<div className="admin-counter-card">
        <h3><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></h3>
        <p><strong>Merchants:</strong></p>
        <ul>
            {merchants.map(merchant => (<li>
                <span>{merchant.name} - {merchant.email}</span><span className="remove-user" onClick={() => handleDeleteUser(merchant._id)}>X</span>
            </li>))}
        </ul>
        <input placeholder="Start typing to search for merchants" type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        {showDropdown && <div className="dropdown">
            {users.map(user => (
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

export const ManageCountersPage = () => {
    const [counters, setCounters] = useState([]);   // TODO: move to admin slice
    const [counterName, setCounterName] = useState('');
    const dispatch = useDispatch();

    const fetchCounters = () => {
        axios.get('http://localhost:5050/counters')
            .then(response => setCounters(response.data))
            .catch(error => console.error('Error fetching counters:', error));
    };

    const addCounter = (name) => {
        axios.post(`http://localhost:5050/counters`, { name })
            .then(r => {
                setCounterName("");
                fetchCounters()
            })
            .catch(error => console.error('Error adding counter:', error));
    }

    const updateCounter = (counter) => {
        axios.put(`http://localhost:5050/counters/${counter._id}`, counter)
            .then(fetchCounters)
            .catch(error => console.error('Error updating counter:', error));
    }

    const deleteCounter = (counterId) => {
        axios.delete(`http://localhost:5050/counters/${counterId}`)
            .then(fetchCounters)
            .catch(error => console.error('Error deleting counter:', error));
    }
    useEffect(() => {
        fetchCounters();
        axios.get('http://localhost:5050/users')
            .then(response => dispatch(setUsers(response.data)))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    return (
        <div className="manage-counters">
            <h1>Manage Counters</h1>
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