import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DishCard } from "./Dish";

export const CounterCard = ({ counter }) => {
    const navigate = useNavigate();
    const onClick = () => {
        navigate(`/counter/${counter._id}`)
    };
    return (
        <div className="counter-card" onClick={onClick}>
            <h3>{counter.name}</h3>
            <p>{counter.name}</p>
        </div>
    );
};

export const CounterPage = ({ counterId }) => {
    const [dishes, setDishes] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5050/dishes?counter=${counterId}`)
            .then(response => setDishes(response.data))
            .catch(error => console.error('Error fetching dishes:', error));
    }, [counterId]);

    return (
        <div>
            <h1>Counter Dishes</h1>
            <div>
                {dishes.map(dish => <DishCard key={dish._id} dish={dish} />)}
            </div>
        </div>
    );
};