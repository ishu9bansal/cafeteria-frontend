import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DishCard, DishForm } from "./Dish";
import { useDispatch, useSelector } from "react-redux";
import { setCounter, setDishes } from "../slices/counterSlice";
import { retryApi } from "../utils";
import { ROLE } from "../constants";
import { CountersAdminView } from "./Admin";

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

    const fetchDishes = async (counterId) => {
        try {
            const dishes = await retryApi('get', `/dishes?counter=${counterId}`);
            dispatch(setDishes(dishes));
        } catch (err) {
            console.error('Error fetching dishes:', err)
        }
    }

    useEffect(() => {
        fetchDishes(counterId)
        return () => dispatch(setDishes([]));
    }, [counterId]);

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

export const ManageCounters = () => {
    const [counters, setCounters] = useState([]);
    const user = useSelector(state => state.auth.user);
    const isMerchantView = user?.role === ROLE.Merchant;
    const query = isMerchantView ? `?merchants=${user._id}` : '';

    const fetchCounters = async (filters = '') => {
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
            <h1>Manage Counters</h1>
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

const selectCanUserEditCounter = (state) => {
    // return false;
    const { user } = state.auth;
    const { details: counter } = state.counter;

    return user && counter && counter.merchants?.map(m => m._id).includes(user._id);
};