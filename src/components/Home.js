import { useEffect, useState } from "react";
import { CounterCard } from "./Counter";
import { retryApi } from "../utils";

export const HomePage = ({ merchantId }) => {
    const [counters, setCounters] = useState([]);
    const title = merchantId ? 'My Counters' : 'Home Page';
    const query = merchantId ? `?merchants=${merchantId}` : '';

    const fetchCounters = async (filters) => {
        try {
            const counters = await retryApi('get', '/counters' + filters);
            setCounters(counters);
        } catch (err) {
            console.error('Error fetching counters:', err);
        }
    }

    useEffect(() => {
        fetchCounters(query);
    }, [query]);

    return (
        <div>
            <h1>{title}</h1>
            <div>
                {counters.map(counter => <CounterCard key={counter._id} counter={counter} />)}
            </div>
        </div>
    );
};