import axios from "axios";
import { setCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux";

export const DishCard = ({ dish }) => {
    const dispatch = useDispatch();
    const onAddToCart = () => {
        axios.post(`http://localhost:5050/cart/${dish._id}`)
            .then(response => {
                dispatch(setCart(response.data));
            })
            .catch(error => console.error('Error adding to cart:', error));
    };
    return (
        <div className="dish-card">
            <h4>{dish.name}</h4>
            <p>Price: ₹{dish.price}</p>
            <p>{dish.inStock ? 'In Stock' : 'Out of Stock'}</p>
            <p>{dish.counter.name}</p>
            <button disabled={!dish.inStock} onClick={onAddToCart}>Add to Cart</button>
        </div>
    );
};