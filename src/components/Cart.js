import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../slices/cartSlice";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRetryApi } from "../hooks";
import { setLoading } from "../slices/cartSlice";

const CartItem = ({ item, showError, loading }) => {
    const dispatch = useDispatch();
    const retryPatchCall = useRetryApi('patch');
    const retryDeleteCall = useRetryApi('delete');

    const onRemove = async () => {
        dispatch(setLoading(true));
        try {
            const cart = await retryDeleteCall(`/cart/${item.dish._id}`);
            dispatch(setCart(cart));
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || "Error while removing from cart";
            const msg = errorMessage.split(':').reverse()[0];
            showError(msg);
            console.error('Error removing from cart:', err)
        }
        dispatch(setLoading(false));
    };

    const onChangeQuantity = async (inc) => {
        dispatch(setLoading(true));
        try {
            const cart = await retryPatchCall(`/cart/${item.dish._id}`, { changeQuantity: inc });
            dispatch(setCart(cart));
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || "Error while changing the quantity";
            const msg = errorMessage.split(':').reverse()[0];
            showError(msg);
            console.error('Error changing quantity in cart:', err);
        }
        dispatch(setLoading(false));
    };
    return (
        <div className="cart-item">
            <h5>{item.dish.name}</h5>
            <p>Price: ₹{item.dish.price}</p>

            <div className="cart-item-quantity">
                <button disabled={loading} onClick={() => onChangeQuantity(-1)}>-</button>
                <p>{item.quantity}</p>
                <button disabled={loading} onClick={() => onChangeQuantity(1)}>+</button>
            </div>

            <button disabled={loading} className="cart-item-remove" onClick={onRemove}>Remove</button>
        </div>
    );
};

export const CartPage = () => {
    const dispatch = useDispatch();
    const retryDeleteCall = useRetryApi('delete');
    const loading = useSelector(state => state.cart.loading);
    const cart = useSelector(state => state.cart.items);
    const total = cart.reduce((acc, item) => (acc + item.quantity * item.dish.price), 0);
    const [error, setError] = useState("");
    const showError = (msg) => {
        setError(msg);
        setTimeout(() => setError(""), 3000);
    };

    const onEmptyCart = async () => {
        if (loading) return;
        dispatch(setLoading(true));
        try {
            const cart = await retryDeleteCall(`/cart`);
            dispatch(setCart(cart));
        }
        catch (err) {
            console.error('Error emptying cart:', err)
        }
        dispatch(setLoading(false));
    };

    const linkStyle = { cursor: loading ? 'not-allowed' : 'pointer' };

    return (
        <div>
            <h1>Cart</h1>
            <ul>
                {cart.map(item => <CartItem key={item._id} item={item} showError={showError} loading={loading} />)}
            </ul>
            <div className="cart-checkout">
                <Link style={linkStyle} onClick={onEmptyCart}>Empty Cart</Link>
                <button><h2>Pay: ₹{total}{" >"}</h2></button>
            </div>
            {error && <div className="cart-error">{error}</div>}
        </div>
    );
};