import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { removeUser } from '../slices/authSlice';
import { useState } from 'react';
import axios from 'axios';

export function Auth() {
    const user = useSelector(state => state.auth.currentUser);
    const location = useLocation();
    return (
        user
            ? <Outlet />
            : <Navigate to='/login' state={{ from: location.pathname }} />
    );
}

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const nextPage = location.state?.from || '/';
    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        axios.post('http://localhost:5050/login', { email, password })
            .then(response => {
                const { token, refreshToken } = response.data;
                dispatch(removeUser());
                localStorage.setItem('token', token);
                localStorage.setItem('refreshToken', refreshToken);
                navigate(nextPage);
            }).catch(err => {
                console.log(error);
                const errMessage = err.response?.data?.message || "Something went wrong";
                setError(errMessage);
            });
    };
    return (
        <>
            <form className="form-container" onSubmit={handleLogin}>
                <h1 className="form-heading">Login</h1>
                <div className="input-container">
                    <label className="input-label">Email</label>
                    <input type="text" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-container">
                    <label className="input-label">Password</label>
                    <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <input type="submit" value="Login" className="submit-button" />
            </form>

            {
                error && <div className='auth-error'>
                    {error}
                </div>
            }

            <div className="auth-footer">
                Don't have an account? <Link to="/register">Register</Link>
                <br />
                <Link to="/cart">Cart</Link>
                <br />
                <Link to="/">Home</Link>
            </div>
        </>
    );
}

export function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const handleRegister = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (password !== password2) {
            setError('Password mismatch!!');
            return;
        }
        axios.post('http://localhost:5050/register', { username, email, password })
            .then(response => {
                setSuccess("User created successfully! Proceed to login.")
            }).catch(err => {
                const errMessage = err?.response?.data?.message || "Something went wrong!";
                setError(errMessage);
            });
    };
    return (
        <>
            <form className="form-container" onSubmit={handleRegister}>
                <h1 className="form-heading">Register</h1>
                <div className="input-container">
                    <label className="input-label">Name</label>
                    <input type="text" className="input-field" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-container">
                    <label className="input-label">Email</label>
                    <input type="text" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-container">
                    <label className="input-label">Password</label>
                    <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input-container">
                    <label className="input-label">Confirm Password</label>
                    <input type="password" className="input-field" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                </div>
                <input type="submit" value="Register" className="submit-button" />
            </form>
            {
                error && <div className='auth-error'>
                    {error}
                </div>
            }
            {
                success && <div className='auth-success'>
                    {success}
                </div>
            }
            <div className="auth-footer">
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </>
    );
}