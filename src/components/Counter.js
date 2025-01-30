import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DishCard, DishForm } from "./Dish";
import { useDispatch, useSelector } from "react-redux";
import { setCounter, setDishes } from "../slices/counterSlice";
import { ROLE } from "../constants";
import { CountersAdminView } from "./Admin";
import { useRetryApi } from "../hooks";

export const CounterCard = ({ counter }) => {
    const navigate = useNavigate();
    const onClick = () => {
        navigate(`/counter/${counter._id}`);
    };
    return (
        <div className="counter-card" onClick={onClick}>
            <h3>{counter.name}</h3>
            <p>{counter.name}</p>
        </div>
    );
};

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

const selectCanUserEditCounter = (state) => {
    // return false;
    const { user } = state.auth;
    const { details: counter } = state.counter;

    return user && counter && counter.merchants?.includes(user._id);
};