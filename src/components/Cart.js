import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../slices/cartSlice";
import { retryApi } from "../utils";

const CartItem = ({ item }) => {
    const dispatch = useDispatch();

    const onRemove = async () => {
        try {
            const cart = await retryApi('delete', `/cart/${item.dish._id}`);
            dispatch(setCart(cart));
        }
        catch (err) {
            console.error('Error removing from cart:', err)
        }
    };

    const onChangeQuantity = async (inc) => {
        try {
            const cart = await retryApi('patch', `/cart/${item.dish._id}`, { changeQuantity: inc });
            dispatch(setCart(cart));
        }
        catch (err) {
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
    const cart = useSelector(state => state.cart.items);
    const total = useSelector(state => state.cart.items.reduce((acc, item) => (acc + item.quantity * item.dish.price), 0));

    return (
        <div>
            <h1>Cart</h1>
            <ul>
                {cart.map(item => <CartItem key={item._id} item={item} />)}
            </ul>
            <div className="cart-checkout">
                <button><h2>Pay: ₹{total}{" >"}</h2></button>
            </div>
        </div>
    );
};