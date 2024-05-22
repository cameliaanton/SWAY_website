import React, { useState } from 'react';
import { changePassword } from '../service/loginService';
import { useNavigate, Link, Navigate } from 'react-router-dom';

import "../styles/changePassword.css";

function ChangePassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errMess, setErrMess] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRePasswordChange = (e) => {
        setRePassword(e.target.value);
    };

    const handleChangePassword = async () => {
        const requestBody = {
            email: email,
            password: password,
            repeatPassword: rePassword
        };
        console.log("Request body:", requestBody);
        try {
            const response = await changePassword(requestBody);
            const changeData = response.data;
            alert('Password changed successfully! Please log in.');
            navigate('/login');
        } catch (error) {
            if (error.response) {
                setErrMess('An error occurred: ' + error.response.data);
            } else {
                setErrMess('An error occurred.');
            }
        }
    };

    return (
        <div className='container-change-password'>
            <h1 className='change-password-title'>Change Password</h1>
            <div className='change-password-field'>
                <label>Email:</label>
                <input type="text" value={email} onChange={handleEmailChange} className='change-password-input' />
            </div>
            <div className='change-password-field'>
                <label>Password:</label>
                <input type="password" value={password} onChange={handlePasswordChange} className='change-password-input' />
            </div>
            <div className='change-password-field'>
                <label>Repeat password:</label>
                <input type="password" value={rePassword} onChange={handleRePasswordChange} className='change-password-input' />
            </div>
            <div className='errors'>
                <label style={{ color: '#f44336' }}>{errMess}</label>
            </div>
            <button onClick={handleChangePassword} className='button-change-password'>Change Password</button>
        </div>
    );
}

export default ChangePassword;
