import axios from "axios";
import { setCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

export const DishCard = ({ dish, isEditable = false, onUpdateDish, onDeleteDish }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: dish.name,
        price: dish.price,
        inStock: dish.inStock,
    });

    const onAddToCart = () => {
        axios.post(`http://localhost:5050/cart/${dish._id}`)
            .then(response => {
                dispatch(setCart(response.data));
            })
            .catch(error => console.error('Error adding to cart:', error));
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm({
            ...editForm,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const saveChanges = () => {
        axios.put(`http://localhost:5050/dishes/${dish._id}`, editForm)
            .then(response => {
                onUpdateDish(response.data); // Update the dish in the parent component
                setIsEditing(false);
            })
            .catch(error => console.error('Error updating dish:', error));
    };
    const deleteDish = () => {
        axios.delete(`http://localhost:5050/dishes/${dish._id}`)
            .then(response => {
                onDeleteDish(dish._id);
            })
            .catch(error => console.error('Error updating dish:', error));
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
                    <p>{dish.counter.name}</p>
                    {!isEditable && (<button
                        disabled={!dish.inStock}
                        onClick={onAddToCart}
                    >
                        Add to Cart
                    </button>)}
                    {isEditable && (<>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={deleteDish}>Delete</button>
                    </>)}
                </>
            )}
        </div>
    );
};




export const DishForm = ({ counterId, onClose, onDishCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        inStock: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:5050/dishes`, {
            ...formData,
            hello: 'world',
            counter: counterId, // Attach the counter ID to associate the dish with the current counter
        })
            .then(response => {
                onDishCreated(response.data); // Inform parent component about the new dish
                onClose(); // Close the form/modal
            })
            .catch(error => console.error('Error creating dish:', error));
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
