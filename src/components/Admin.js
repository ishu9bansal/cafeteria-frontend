import axios from "axios";
import { useEffect, useState } from "react";

const StaticCounterCard = ({ counter, setEditing, handleDelete }) => {
    return (<div className="counter-card">
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

    const handleSearch = (newQuery) => {
        setQuery(newQuery);
        // trigger search
    }

    const handleDeleteUser = (merchantId) => {
        const updatedMerchants = merchants.filter(m => m._id !== merchantId);
        setMerchants(updatedMerchants);
    }

    return (<div className="counter-card">
        <h3><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></h3>
        <p><strong>Merchants:</strong></p>
        <ul>
            {merchants.map(merchant => (<li>
                <span>{merchant.name} - {merchant.email}</span>
                <button onClick={handleDeleteUser(merchant._id)}>X</button>
            </li>))}
            <li>Hello</li>
            <li><input placeholder="Start typing to search for merchants" type="text" value={query} onChange={(e) => handleSearch(e.target.value)} /></li>
        </ul>
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
        handleSave({ _id: counter._id, name, merchants });
    }

    return (editing
        ? <EditingCounterCard counter={counter} handleSave={onHandleSave} onCancel={() => setEditing(false)} />
        : <StaticCounterCard counter={counter} setEditing={setEditing} handleDelete={() => handleDelete(counter._id)} />
    );
};

export const ManageCountersPage = () => {
    const [counters, setCounters] = useState([]);
    const [counterName, setCounterName] = useState('');

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
    useEffect(fetchCounters, []);

    return (
        <div className="manage-counters">
            <h1>Manage Counters</h1>
            <input type="text" placeholder="Name of the new counter..." value={counterName} onChange={(e) => setCounterName(e.target.value)} />
            <button onClick={() => addCounter(counterName)}>
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