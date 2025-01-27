import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from './slices/authSlice';
import { setCart } from './slices/cartSlice';
import { HomePage } from './components/Home';
import { CounterPage } from './components/Counter';
import { ProfilePage } from './components/Profile';
import { CartPage } from './components/Cart';
import { UsersPage } from './components/User';
import { ManageCountersPage } from './components/Admin';
import { Auth, Login, Register } from './components/Auth';
import { retryApi } from './utils';

const App = () => {
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();
  const fetchUser = async () => {
    dispatch(setLoading(true));
    try {
      const user = await retryApi('get', '/cart');
      const cart = [...user.cart];
      delete (user.cart);
      dispatch(setUser(user));
      dispatch(setCart(cart));
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  React.useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Navbar />}>
          <Route element={<Auth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/counters" element={<ManageCountersPage />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
};

export default App;