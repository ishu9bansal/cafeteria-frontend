import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DishCard, DishForm } from "../components/Dish";
import { useRetryApi } from "../hooks";
import { selectCanUserEditCounter, setCounter, setDishes } from "../slices/counterSlice";

export const CounterPage = () => {
    const { counterId } = useParams();
    const canEdit = useSelector(selectCanUserEditCounter);
    const fetchDishesApi = canEdit ? `/counter/${counterId}` : `/dishes?counter=${counterId}`;
    const dishes = useSelector(state => state.counter.dishes);
    const counter = useSelector(state => state.counter.details);
    const [showForm, setShowForm] = useState(false);
    const retryGetApi = useRetryApi('get');
    const dispatch = useDispatch();

    const fetchDishes = async () => {
        try {
            const { dishes, counter } = await retryGetApi(fetchDishesApi);
            dispatch(setDishes(dishes));
            dispatch(setCounter(counter));
        } catch (err) {
            console.error('Error fetching dishes:', err)
        }
    }

    useEffect(() => {
        fetchDishes()
        return () => {
            dispatch(setDishes([]));
            dispatch(setCounter(null));
        };
    }, []);

    const handleDishCreated = (newDish) => {
        dispatch(setDishes([...dishes, newDish])); // Add the new dish to the existing list
    };

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
            <h1>{counter?.name || "Loading..."}</h1>
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
