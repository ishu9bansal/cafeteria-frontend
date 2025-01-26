import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './slices/authSlice';
import { setCart } from './slices/cartSlice';
import { HomePage } from './components/Home';
import { CounterPage } from './components/Counter';
import { ProfilePage } from './components/Profile';
import { CartPage } from './components/Cart';
import { UsersPage } from './components/User';
import { ManageCountersPage } from './components/Admin';
import { Login, Register } from './components/Auth';

const App = () => {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:5050/cart');
      const user = response.data;
      const cart = [...user.cart];
      delete (user.cart);
      dispatch(setUser(user));
      dispatch(setCart(cart));
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  React.useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);
  // TODO: conditional navbar for auth pages

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/counter" element={<CounterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/counters" element={<ManageCountersPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
};

export default App;