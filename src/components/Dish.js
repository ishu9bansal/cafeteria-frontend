import { setCart, setLoading } from "../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRetryApi } from "../hooks";

export const DishCard = ({ dish, isEditable = false, onUpdateDish, onDeleteDish }) => {
    const cartDishes = useSelector(state => state.cart.items.map(item => item.dish._id));
    const cartLoading = useSelector(state => state.cart.loading);
    const existInCart = cartDishes.includes(dish._id);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: dish.name,
        price: dish.price,
        inStock: dish.inStock,
    });
    const retryPostApi = useRetryApi('post');
    const retryPutApi = useRetryApi('put');
    const retryDeleteApi = useRetryApi('delete');


    const goToCart = () => {
        navigate('/cart');
    }

    const onAddToCart = async () => {
        dispatch(setLoading(true));
        try {
            const cart = await retryPostApi(`/cart/${dish._id}`);
            dispatch(setCart(cart));
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
        dispatch(setLoading(false));
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm({
            ...editForm,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const saveChanges = async () => {
        try {
            const updatedDish = await retryPutApi(`/counter/${dish.counter}/${dish._id}`, editForm);
            onUpdateDish(updatedDish); // Update the dish in the parent component
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating dish:', err);
        }
    };
    const deleteDish = async () => {
        try {
            await retryDeleteApi(`/counter/${dish.counter}/${dish._id}`);
            onDeleteDish(dish._id);
        } catch (err) {
            console.error('Error deleting dish:', err);
        }
    };

    return (
        <div className={`dish-card ${isEditing ? 'editing' : ''}`}>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Dish Name"
                    />
                    <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Price"
                        min="0"
                    />
                    <label>
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={editForm.inStock}
                            onChange={handleEditChange}
                        />
                        In Stock
                    </label>
                    <br />
                    <button onClick={saveChanges}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{dish.name}</h4>
                    <p>Price: ₹{dish.price}</p>
                    <p>{dish.inStock ? 'In Stock' : 'Out of Stock'}</p>
                    {!isEditable && (<>
                        {existInCart
                            ? (<button className="go-to" onClick={goToCart}>
                                Go to Cart
                            </button>)
                            : (<button disabled={!dish.inStock || cartLoading} onClick={onAddToCart}>
                                Add to Cart
                            </button>)
                        }
                        <button hidden></button>
                    </>)}
                    {isEditable && (<>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={deleteDish}>Delete</button>
                    </>)}
                </>
            )
            }
        </div >
    );
};




export const DishForm = ({ counterId, onClose, onDishCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        inStock: true,
    });
    const retryPostApi = useRetryApi('post');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dish = await retryPostApi(`/counter/${counterId}`, formData);
            onDishCreated(dish); // Inform parent component about the new dish
            onClose(); // Close the form/modal
        } catch (err) {
            console.error('Error creating dish:', err);
        }
    };

    return (
        <form className="dish-form" onSubmit={handleSubmit}>
            <h3>Create New Dish</h3>
            <input
                type="text"
                name="name"
                placeholder="Dish Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
            />
            <label>
                <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                />
                In Stock
            </label>
            <br />
            <button type="submit">Create Dish</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
};
