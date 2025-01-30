import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { ROLE } from '../constants';

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    const cartCount = useSelector(state => state.cart.items.length);
    return (
        <>
            <nav className="navbar">
                <Link to="/">Home</Link>
                {user && <Link to="/cart">Cart {cartCount ? <strong> ({cartCount})</strong> : ""}</Link>}
                {user && user.role === ROLE.Merchant && <Link to="/counters">My Counters</Link>}
                {user && user.role === ROLE.Admin && <Link to="/users">Manage Users</Link>}
                {user && user.role === ROLE.Admin && <Link to="/counters">Manage Counters</Link>}
                {user && <Link to="/profile">Profile</Link>}
            </nav>
            <Outlet />
        </>
    );
};

export default Navbar;