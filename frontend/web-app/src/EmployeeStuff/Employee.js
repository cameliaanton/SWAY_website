import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/employee.css'; // Add appropriate styling
import axios from 'axios';

const Employee = ({ user }) => {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState({
        orders: [],
        products: [],
        customers: [],
    });

    const fetchEmployeeData = async () => {
        try {
            const ordersResponse = await axios.get('http://localhost:8080/employee/orders');
            const productsResponse = await axios.get('http://localhost:8080/employee/products'); // Assume endpoint exists
            const customersResponse = await axios.get('http://localhost:8080/employee/customers'); // Assume endpoint exists

            setEmployeeData({
                orders: ordersResponse.data,
                products: productsResponse.data,
                customers: customersResponse.data,
            });
        } catch (error) {
            console.error("Error fetching employee data:", error);
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    return (
        <div className="employee-container">
            <h1>Employee Dashboard</h1>
            <div className="employee-sections">
                <div className="employee-section">
                    <h2>Orders Management</h2>
                    <Link to="/employee/orders">Manage Orders</Link>
                </div>
                <div className="employee-section">
                    <h2>Products Management</h2>
                    <Link to="/employee/products">Manage Products</Link>
                </div>
                <div className="employee-section">
                    <h2>Customer Management</h2>
                    <Link to="/employee/customers">View Customers</Link>
                </div>
                <div className="employee-section">
                    <h2>Sales Analysis</h2>
                    <Link to="/employee/sales">View Sales Data</Link>
                </div>
            </div>
        </div>
    );
};

export default Employee;
