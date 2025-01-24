import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);

    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            {user && <Link to="/cart">Cart</Link>}
            {user && user.role === 'Admin' && <Link to="/users">Manage Users</Link>}
            {user && user.role === 'Admin' && <Link to="/counters">Manage Counters</Link>}
            {user && user.role === 'Merchant' && <Link to="/counters">My Counters</Link>}
            {user && <Link to="/profile">Profile</Link>}
        </nav>
    );
};

export default Navbar;