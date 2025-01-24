import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../slices/cartSlice";

const CartItem = ({ item, onUpdateQuantity }) => {
    const dispatch = useDispatch();

    const onRemove = () => {
        axios.delete(`http://localhost:5050/cart/${item.dish._id}`)
            .then(response => {
                dispatch(setCart(response.data));
            })
            .catch(error => console.error('Error removing from cart:', error));
    };
    // TODO: use + - buttons and add cart quantity change logic
    return (
        <div className="cart-item">
            <h5>{item.dish.name}</h5>
            <p>Price: ₹{item.dish.price}</p>
            <p>Quantity: </p>
            <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdateQuantity(item.dish.id, parseInt(e.target.value, 10))}
            />
            <button onClick={onRemove}>Remove</button>
        </div>
    );
};

export const CartPage = () => {
    const cart = useSelector(state => state.cart.items);

    return (
        <div>
            <h1>Cart</h1>
            <ul>
                {cart.map(item => <CartItem item={item} />)}
            </ul>
        </div>
    );
};