import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DishCard, DishForm } from "./Dish";
import { useDispatch, useSelector } from "react-redux";
import { setCounter, setDishes } from "../slices/counterSlice";

export const CounterCard = ({ counter }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(setCounter(counter))
        navigate(`/counter`)
    };
    return (
        <div className="counter-card" onClick={onClick}>
            <h3>{counter.name}</h3>
            <p>{counter.name}</p>
        </div>
    );
};

export const CounterPage = () => {
    const counter = useSelector(state => state.counter.details);
    const counterId = counter._id;
    const canEdit = useSelector(selectCanUserEditCounter);
    const dishes = useSelector(state => state.counter.dishes);
    const [showForm, setShowForm] = useState(false);
    const dispatch = useDispatch();

    const handleDishCreated = (newDish) => {
        dispatch(setDishes([...dishes, newDish])); // Add the new dish to the existing list
    };

    useEffect(() => {
        axios.get(`http://localhost:5050/dishes?counter=${counterId}`)
            .then(response => dispatch(setDishes(response.data)))
            .catch(error => console.error('Error fetching dishes:', error));
        return () => dispatch(setDishes([]));
    }, [counterId]);

    const onUpdateDish = (dish) => {
        const updatedDishes = dishes.map(d => d._id === dish._id ? dish : d);
        dispatch(setDishes(updatedDishes));
    };

    const onDeleteDish = (dishId) => {
        const updatedDishes = dishes.filter(d => d._id !== dishId);
        dispatch(setDishes(updatedDishes));
    };

    return (
        <div>
            <h1>{counter.name}</h1>
            {canEdit &&
                <button className="new-dish" onClick={() => setShowForm(true)}>Add New Dish</button>}

            {showForm && (
                <DishForm
                    counterId={counterId}
                    onClose={() => setShowForm(false)}
                    onDishCreated={handleDishCreated}
                />
            )}
            <div>
                {dishes.map(dish => <DishCard key={dish._id} dish={dish} isEditable={canEdit} onUpdateDish={onUpdateDish} onDeleteDish={onDeleteDish} />)}
            </div>
        </div>
    );
};

const selectCanUserEditCounter = (state) => {
    // return false;
    const { user } = state.auth;
    const { details: counter } = state.counter;

    return user && counter && counter.merchants?.map(m => m._id).includes(user._id);
};