import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { useRetryApi } from './hooks';
import { Auth, Login, Register } from './pages/AuthPages';
import { CartPage } from './pages/CartPage';
import { CounterPage } from './pages/CounterPage';
import { HomePage } from './pages/HomePage';
import { ManageCounters } from './pages/ManageCounters';
import { ProfilePage } from './pages/ProfilePage';
import { UsersPage } from './pages/UsersPage';
import { setLoading, setUser } from './slices/authSlice';
import { setCart } from './slices/cartSlice';

const App = () => {
  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();
  const retryGetApi = useRetryApi('get');
  const fetchUser = async () => {
    dispatch(setLoading(true));
    try {
      const user = await retryGetApi('/cart');
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
          <Route path="/counter/:counterId" element={<CounterPage />} /> {/* TODO: handle the view changes for logged out user */}
          <Route element={<Auth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/counters" element={<ManageCounters />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
};

export default App;