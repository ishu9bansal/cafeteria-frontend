import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const Navbar = () => (
  <nav>
    <Link to="/">Home</Link>
    <Link to="/cart">Cart</Link>
    <Link to="/profile">Profile</Link>
  </nav>
);

const HomePage = () => {
  const [counters, setCounters] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:5050/counters')
      .then(response => setCounters(response.data))
      .catch(error => console.error('Error fetching counters:', error));
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <ul>
        {counters.map(counter => (
          <li key={counter._id}>
            <Link to={`/counter/${counter._id}`}>{counter.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CounterPage = ({ counterId }) => {
  const [dishes, setDishes] = React.useState([]);

  React.useEffect(() => {
    axios.get(`http://localhost:5050/dishes?counter=${counterId}`)
      .then(response => setDishes(response.data))
      .catch(error => console.error('Error fetching dishes:', error));
  }, [counterId]);

  return (
    <div>
      <h1>Counter Dishes</h1>
      <ul>
        {dishes.map(dish => (
          <li key={dish._id}>{dish.name} - ${dish.price}</li>
        ))}
      </ul>
    </div>
  );
};

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

const App = () => (
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

export default App;