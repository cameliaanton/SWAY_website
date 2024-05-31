import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/addUser.css'; // Ensure this import is correct

const apiBaseURL = 'http://localhost:8080';

const AddUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        username: '',
        email: '',
        role: '2', // Default to Employee
        password: '',
        repeatPassword: ''
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const userToAdd = {
                user: {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: parseInt(user.role),
                    type: user.role === '0' ? 'admin' : 'employee'
                },
                password: user.password,
                repeatPassword: user.repeatPassword
            };
            await axios.post(`${apiBaseURL}/admin/addUser`, userToAdd);
            navigate('/admin/manage-users');
        } catch (error) {
            console.error("Error adding user:", error);
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="add-user-container">
            <h1>Add New User</h1>
            <form onSubmit={handleAddUser}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        name="role"
                        value={user.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="0">Admin</option>
                        <option value="2">Employee</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Repeat Password</label>
                    <input
                        type="password"
                        name="repeatPassword"
                        value={user.repeatPassword}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Add User</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default AddUser;
