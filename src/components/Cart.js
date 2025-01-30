import { useDispatch } from "react-redux";
import { setCart } from "../slices/cartSlice";
import { useRetryApi } from "../hooks";
import { setLoading } from "../slices/cartSlice";

export const CartItem = ({ item, showError, loading }) => {
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
