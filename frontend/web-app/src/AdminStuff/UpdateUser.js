import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import '../styles/updateUser.css'; // Add appropriate styling

const apiBaseURL = 'http://localhost:8080';

const UpdateUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        username: '',
        email: '',
        type: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/admin/user/${id}`);
            setUser(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user:", error);
            setError(error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${apiBaseURL}/admin/users/${id}`, user);
            navigate('/admin/manage-users');
        } catch (error) {
            console.error("Error updating user:", error);
            setError(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="update-user-container">
            <h1>Update User</h1>
            <form onSubmit={handleUpdateUser}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Type</label>
                    <select
                        name="type"
                        value={user.type}
                        onChange={handleInputChange}
                    >
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                    </select>
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UpdateUser;
