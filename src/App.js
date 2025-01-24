import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import { useDispatch } from 'react-redux';
import { setUser } from './slices/authSlice';
import { setCart } from './slices/cartSlice';
import { HomePage } from './components/Home';
import { CounterPage } from './components/Counter';


const CartPage = () => {
  const [cart, setCart] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:5050/cart')
      .then(response => setCart(response.data.cart))
      .catch(error => console.error('Error fetching cart:', error));
  }, []);

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.map(item => (
          <li key={item.dish._id}>{item.dish.name} - Quantity: {item.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

const ProfilePage = () => {
  const [user, setUser] = React.useState({ name: "Guest", email: null });

  React.useEffect(() => {
    axios.get('http://localhost:5050/cart')
      .then(response => setUser(response.data))
      .catch(error => console.error('Error fetching cart:', error));
  }, []);

  return <div>
    <h1>Profile</h1>
    <p><strong>Name: </strong>{user.name}</p>
    <p><strong>Email: </strong>{user.email}</p>
  </div>;
};

const App = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    axios.get('http://localhost:5050/cart')
      .then(response => {
        const user = response.data;
        const cart = [...user.cart];
        delete (user.cart);
        dispatch(setUser(user));
        dispatch(setCart(cart));
      })
      .catch(error => console.error('Error fetching cart:', error));
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/counter/:id" element={<CounterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;