import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../slices/cartSlice";
import { retryApi } from "../utils";
import { useState } from "react";
import { Link } from "react-router-dom";

const CartItem = ({ item, showError }) => {
    const dispatch = useDispatch();

    const onRemove = async () => {
        try {
            const cart = await retryApi('delete', `/cart/${item.dish._id}`);
            dispatch(setCart(cart));
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || "Error while removing from cart";
            const msg = errorMessage.split(':').reverse()[0];
            showError(msg);
            console.error('Error removing from cart:', err)
        }
    };

    const onChangeQuantity = async (inc) => {
        try {
            const cart = await retryApi('patch', `/cart/${item.dish._id}`, { changeQuantity: inc });
            dispatch(setCart(cart));
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || "Error while changing the quantity";
            const msg = errorMessage.split(':').reverse()[0];
            showError(msg);
            console.error('Error changing quantity in cart:', err);
        }
    };
    return (
        <div className="cart-item">
            <h5>{item.dish.name}</h5>
            <p>Price: ₹{item.dish.price}</p>

            <div className="cart-item-quantity">
                <button onClick={() => onChangeQuantity(-1)}>-</button>
                <p>{item.quantity}</p>
                <button onClick={() => onChangeQuantity(1)}>+</button>
            </div>

            <button className="cart-item-remove" onClick={onRemove}>Remove</button>
        </div>
    );
};

export const CartPage = () => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.items);
    const total = cart.reduce((acc, item) => (acc + item.quantity * item.dish.price), 0);
    const [error, setError] = useState("");
    const showError = (msg) => {
        setError(msg);
        setTimeout(() => setError(""), 3000);
    };

    const onEmptyCart = async () => {
        try {
            const cart = await retryApi('delete', `/cart`);
            dispatch(setCart(cart));
        }
        catch (err) {
            console.error('Error emptying cart:', err)
        }
    };

    return (
        <div>
            <h1>Cart</h1>
            <ul>
                {cart.map(item => <CartItem key={item._id} item={item} showError={showError} />)}
            </ul>
            <div className="cart-checkout">
                <Link onClick={onEmptyCart}>Empty Cart</Link>
                <button><h2>Pay: ₹{total}{" >"}</h2></button>
            </div>
            {error && <div className="cart-error">{error}</div>}
        </div>
    );
};