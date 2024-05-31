import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/manageUsers.css'; // Add appropriate styling
import { FaArrowLeft } from 'react-icons/fa';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const filterUsers = () => {
        const query = searchQuery.toLowerCase();
        setFilteredUsers(users.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.type.toLowerCase().includes(query) // Filtering by type
        ));
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/admin/user/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleUpdateUser = (user) => {
        navigate(`/admin/update-user/${user.id}`);
    };
    const handleAddUser = () => {
        navigate('/admin/add-user');
    };
    return (
        <div className="manage-users-container">
            <button className="back-button" onClick={() => navigate('/admin')}>
                <FaArrowLeft /> Back to Admin
            </button>
            <h1>Manage Users</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by Name, Username, Email, Type"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button className="add-user-button" onClick={handleAddUser}>Add User</button>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.type}</td>
                            <td>
                                <button onClick={() => handleUpdateUser(user)}>Update</button>
                                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
