import axios from "axios";
import { setCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

export const DishCard = ({ dish, isEditable = false, onUpdateDish }) => {
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
                    {isEditable && (
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                </>
            )}
        </div>
    );
};
