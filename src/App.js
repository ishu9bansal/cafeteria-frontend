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
import { ProfilePage } from './components/Profile';
import { CartPage } from './components/Cart';
import { UsersPage } from './components/User';
import { ManageCountersPage } from './components/Admin';

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
        <Route path="/counter" element={<CounterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/counters" element={<ManageCountersPage />} />

      </Routes>
    </Router>
  );
};

export default App;