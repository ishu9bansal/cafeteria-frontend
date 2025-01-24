import axios from "axios";
import { useEffect, useState } from "react";
import { CounterCard } from "./Counter";

export const HomePage = () => {
    const [counters, setCounters] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5050/counters')
            .then(response => setCounters(response.data))
            .catch(error => console.error('Error fetching counters:', error));
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