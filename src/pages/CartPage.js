import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CartItem } from "../components/Cart";
import { useRetryApi } from "../hooks";
import { setCart, setLoading } from "../slices/cartSlice";

export const CartPage = () => {
    const dispatch = useDispatch();
    const retryDeleteCall = useRetryApi('delete');
    const loading = useSelector(state => state.cart.loading);
    const cart = useSelector(state => state.cart.items.filter(item => item.dish));
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