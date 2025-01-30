import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROLE } from "../constants";
import { AdminCounterCard } from "../components/Counter";
import { useRetryApi } from "../hooks";
import { CounterCard } from "../components/Counter";

export const ManageCounters = () => {
    const [counters, setCounters] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.auth.user);
    const isMerchantView = user?.role === ROLE.Merchant;
    const query = isMerchantView ? `?merchants=${user._id}` : '';
    const retryGetApi = useRetryApi('get');

    const fetchCounters = async (filters = '') => {
        setLoading(true);
        try {
            const counters = await retryGetApi('/counters' + filters);
            setCounters(counters);
        } catch (err) {
            console.error('Error fetching counters:', err);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchCounters(query);
    }, [query]);

    return (
        <div>
            <h1>Manage Counters</h1>
            {loading && <h1>Loading...</h1>}
            {isMerchantView
                ? (
                    <div>
                        {counters.map(counter => <CounterCard key={counter._id} counter={counter} />)}
                    </div>
                )
                : (<CountersAdminView counters={counters} fetchCounters={fetchCounters} />)
            }

        </div>
    );
};

const CountersAdminView = ({ counters, fetchCounters }) => {
    const [counterName, setCounterName] = useState('');
    const [loading, setLoading] = useState(false);
    const retryPostApi = useRetryApi('post');
    const retryPutApi = useRetryApi('put');
    const retryDeleteApi = useRetryApi('delete');

    const addCounter = async (e, name) => {
        e.preventDefault();
        setLoading(true);
        try {
            await retryPostApi('/counters', { name });
            await fetchCounters();
            setCounterName("");
        } catch (err) {
            console.error('Error adding counter:', err);
        }
        setLoading(false);
    };

    const updateCounter = async (counter) => {
        try {
            await retryPutApi(`/counters/${counter._id}`, counter);
            await fetchCounters();
        } catch (err) {
            console.error('Error updating counter:', err);
        }
    };

    const deleteCounter = async (counterId) => {
        try {
            await retryDeleteApi(`/counters/${counterId}`);
            await fetchCounters();
        } catch (err) {
            console.error('Error deleting counter:', err);
        }
    };

    return (
        <div className="manage-counters">
            <form className="add-form" onSubmit={(e) => addCounter(e, counterName)}>
                <input disabled={loading} type="text" placeholder="Name of the new counter..." value={counterName} onChange={(e) => setCounterName(e.target.value)} />
                <input disabled={counterName.trim().length === 0 || loading} type="submit" value={"Add New Counter"} />
            </form>
            <div>
                {counters.map(counter => <AdminCounterCard
                    key={counter._id}
                    counter={counter}
                    handleDelete={deleteCounter}
                    handleSave={updateCounter}
                />)}
            </div>
        </div>
    )
};