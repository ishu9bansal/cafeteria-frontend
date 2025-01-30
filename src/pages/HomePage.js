import { useEffect, useState } from "react";
import { CounterCard } from "../components/Counter";
import { useRetryApi } from "../hooks";

export const HomePage = () => {
    const [counters, setCounters] = useState([]);
    const [loading, setLoading] = useState(false);
    const retryGetApi = useRetryApi('get');

    const fetchCounters = async () => {
        setLoading(true);
        try {
            const counters = await retryGetApi('/counters');
            setCounters(counters);
        } catch (err) {
            console.error('Error fetching counters:', err);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchCounters();
    }, []);

    return (
        <div>
            <h1>{loading ? "Loading..." : "Home Page"}</h1>

            <div>
                {counters.map(counter => <CounterCard key={counter._id} counter={counter} />)}
            </div>
        </div>
    );
};