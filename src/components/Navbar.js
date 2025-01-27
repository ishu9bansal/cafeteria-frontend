import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    // TODO: Cart link visibility for all users? or only customers?
    return (
        <>
            <nav className="navbar">
                <Link to="/">Home</Link>
                {user && <Link to="/cart">Cart</Link>}
                {user && user.role === 'Admin' && <Link to="/users">Manage Users</Link>}
                {user && user.role === 'Admin' && <Link to="/counters">Manage Counters</Link>}
                {user && user.role === 'Merchant' && <Link to="/counters">My Counters</Link>}
                {user && <Link to="/profile">Profile</Link>}
            </nav>
            <Outlet />
        </>
    );
};

export default Navbar;