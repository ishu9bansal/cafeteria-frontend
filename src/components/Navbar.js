import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLE } from '../constants';

const Navbar = () => {
    const user = useSelector((state) => state.auth.user);
    return (
        <>
            <nav className="navbar">
                {user && user.role === ROLE.Customer && <Link to="/">Home</Link>}
                {user && user.role === ROLE.Customer && <Link to="/cart">Cart</Link>}
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