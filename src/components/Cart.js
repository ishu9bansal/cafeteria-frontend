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

    const onChangeQuantity = (inc) => {
        axios.patch(`http://localhost:5050/cart/${item.dish._id}`, {
            changeQuantity: inc
        }).then(response => {
            dispatch(setCart(response.data));
        }).catch(error => console.error('Error changing quantity in cart:', error));
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