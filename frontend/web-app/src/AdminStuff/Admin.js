import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/admin.css';

const Admin = ({ user }) => {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState({
        users: [],
        products: [],
        orders: [],
        reports: {},
    });

    useEffect(() => {
        if (!user || user.role !== 0) { // Assuming role 0 is admin
            navigate('/login');
        } else {
            fetchAdminData();
        }
    }, [user, navigate]);

    const fetchAdminData = async () => {
        try {
            const usersResponse = await axios.get('http://localhost:8080/admin/users');
            const productsResponse = await axios.get('http://localhost:8080/admin/products');
            const ordersResponse = await axios.get('http://localhost:8080/admin/orders');
            const reportsResponse = await axios.get('http://localhost:8080/admin/reports');

            setAdminData({
                users: usersResponse.data,
                products: productsResponse.data,
                orders: ordersResponse.data,
                reports: reportsResponse.data,
            });
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    return (
        <div className="admin-container">
            <h1>Admin Dashboard</h1>
            <div className="admin-sections">
                <div className="admin-section">
                    <h2>User Management</h2>
                    <Link to="/admin/users">Manage Users</Link>
                </div>
                <div className="admin-section">
                    <h2>Product Management</h2>
                    <Link to="/admin/products">Manage Products</Link>
                </div>
                <div className="admin-section">
                    <h2>Reports</h2>
                    <Link to="/admin/reports">View Reports</Link>
                </div>
                <div className="admin-section">
                    <h2>Settings</h2>
                    <Link to="/admin/settings">Site Settings</Link>
                </div>
            </div>
        </div>
    );
};

export default Admin;
