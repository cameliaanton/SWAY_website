import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../service/loginService.js';
import "../styles/login.css";

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMess, setErrMess] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async () => {
        const loginData = {
            username: username,
            password: password,
        };

        try {
            const userData = await login(loginData);
            console.log("User data:", userData);

            if (userData && userData.role !== undefined) {
                setErrMess('');
                onLogin(userData);
                console.log("Login successful");
                console.log("Full user data:", userData);
                console.log("User role:", userData.role);

                if (userData.role === 0) {
                    navigate('/admin', { state: { user: userData } });
                } else if (userData.role === 1) {
                    navigate('/home', { state: { user: userData } });
                } else {
                    navigate('/employee', { state: { user: userData } });
                }
            } else {
                setErrMess("Login failed: User data is not complete.");
            }
        } catch (error) {
            //onLogin(null);
            if (error.response) {
                setErrMess('Error: ' + error.response.data);
            } else {
                setErrMess(error.message);
            }
        }
    };

    return (
        <div className="container-login">
            <div className="login-card">
                <h1 className="login-title">Login</h1>
                <p className="login-subtitle">Sign in to continue.</p>
                <div className="login-username">
                    <label>USERNAME/EMAIL</label>
                    <input type="text" value={username} onChange={handleUsernameChange} />
                </div>
                <div className="login-password">
                    <label>PASSWORD</label>
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div className="errors">
                    <label style={{ color: 'red' }}>{errMess}</label>
                </div>
                <button className="button-login" onClick={handleLogin}>Log in</button>
                <p className="forgotpassword">
                    <Link to="/login/changePassword">Forgot Password?</Link>
                </p>
                <p className="signup">
                    <Link to="/register">Signup !</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
