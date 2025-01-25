import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DishCard, DishForm } from "./Dish";

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

export const CounterPage = () => {
    const { id: counterId } = useParams();
    const [dishes, setDishes] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const handleDishCreated = (newDish) => {
        setDishes([...dishes, newDish]); // Add the new dish to the existing list
    };

    useEffect(() => {
        axios.get(`http://localhost:5050/dishes?counter=${counterId}`)
            .then(response => setDishes(response.data))
            .catch(error => console.error('Error fetching dishes:', error));
    }, [counterId]);

    const onUpdateDish = (dish) => {
        const updatedDishes = [...dishes];
        const ind = updatedDishes.findIndex(ele => ele._id === dish._id);
        if (ind >= 0) {
            updatedDishes[ind] = dish;
        }
        setDishes(updatedDishes);
    };

    return (
        <div>
            <h1>Counter Dishes</h1>
            <button className="new-dish" onClick={() => setShowForm(true)}>Add New Dish</button>

            {showForm && (
                <DishForm
                    counterId={counterId}
                    onClose={() => setShowForm(false)}
                    onDishCreated={handleDishCreated}
                />
            )}
            <div>
                {dishes.map(dish => <DishCard key={dish._id} dish={dish} onUpdateDish={onUpdateDish} />)}
            </div>
        </div>
    );
};