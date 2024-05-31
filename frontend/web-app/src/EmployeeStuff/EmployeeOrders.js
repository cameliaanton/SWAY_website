import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/employeeOrders.css';
import { FaArrowLeft } from 'react-icons/fa';

const apiBaseURL = 'http://localhost:8080';

const EmployeeOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/employee/orders`);
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError(error);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const response = await axios.put(`${apiBaseURL}/employee/order/${id}/status/${status}`);
            setOrders(orders.map(order => (order.id === id ? response.data : order)));
        } catch (error) {
            console.error("Error updating order status:", error);
            setError(error);
        }
    };

    const handleStatusChange = (e, id) => {
        const newStatus = e.target.value;
        handleUpdateStatus(id, newStatus);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="employee-orders-container">
            <button className="back-button" onClick={() => navigate('/employee')}>
                <FaArrowLeft /> Back to Employee
            </button>
            <h1>Manage Orders</h1>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Payment Sum</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td><Link to={`/employee/orderDetails/${order.id}`}>{order.id}</Link></td>
                            <td>{order.customerName || 'Unknown Customer'}</td>
                            <td>{order.paymentSum}</td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(e, order.id)}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </td>
                            <td>{new Date(order.dateTime).toLocaleString()}</td>

                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default EmployeeOrders;
