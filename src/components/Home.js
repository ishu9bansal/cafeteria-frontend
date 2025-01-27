import { useEffect, useState } from "react";
import { CounterCard } from "./Counter";
import { retryApi } from "../utils";

export const HomePage = () => {
    const [counters, setCounters] = useState([]);

    const fetchCounters = async () => {
        try {
            const counters = await retryApi('get', '/counters');
            setCounters(counters);
        } catch (err) {
            console.error('Error fetching counters:', err);
        }
    }

    useEffect(() => {
        fetchCounters();
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
            <div>
                {counters.map(counter => <CounterCard key={counter._id} counter={counter} />)}
            </div>
        </div>
    );
};