import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../service/registerService';
import "../styles/register.css";

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errMess, setErrMess] = useState('');

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRePasswordChange = (e) => {
        setRePassword(e.target.value);
    };

    const handleRegister = async () => {
        const requestBody = {
            user: {
                type: "customer", // Include the type for Customer
                name: name,
                username: username,
                email: email,
                role: 1 // Role for Customer
            },
            password: password,
            repeatPassword: rePassword
        };
        try {
            const response = await register(requestBody);
            const userData = response.data;
            setErrMess('');
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            if (error.response) {
                setErrMess('An error occurred: ' + error.response.data);
            } else {
                setErrMess('An error occurred.');
                console.log(error);
            }
        }
    };

    return (
        <div className='container-register'>
            <h1 className='register-title'>Register</h1>
            <div className='register-field'>
                <label>Name:</label>
                <input type="text" value={name} onChange={handleNameChange} className='register-input' />
            </div>
            <div className='register-field'>
                <label>Username:</label>
                <input type="text" value={username} onChange={handleUsernameChange} className='register-input' />
            </div>
            <div className='register-field'>
                <label>Email:</label>
                <input type="text" value={email} onChange={handleEmailChange} className='register-input' />
            </div>
            <div className='register-field'>
                <label>Password:</label>
                <input type="password" value={password} onChange={handlePasswordChange} className='register-input' />
            </div>
            <div className='register-field'>
                <label>Repeat password:</label>
                <input type="password" value={rePassword} onChange={handleRePasswordChange} className='register-input' />
            </div>
            <div className='errors'>
                <label style={{ color: '#f44336' }}>{errMess}</label>
            </div>
            <button onClick={handleRegister} className='button-register'>Register!</button>
            <p className='signin'>
                <span className='signin-text'>You already have an account? </span>
                <Link to="/login" className='signin-link'>LogIn</Link>
            </p>
        </div>
    );
}

export default Register;
