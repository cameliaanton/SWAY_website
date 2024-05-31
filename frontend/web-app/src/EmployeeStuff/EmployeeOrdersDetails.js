import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/employeeOrderDetails.css';

const apiBaseURL = 'http://localhost:8080';

const EmployeeOrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/employee/orders/${orderId}`);
            setOrder(response.data);

            const productsResponse = await axios.get(`${apiBaseURL}/employee/order/getProducts/${orderId}`);
            setProducts(productsResponse.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setError(error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="employee-order-details-container">
            <button className="back-button" onClick={() => navigate('/employee/orders')}>
                Back to Orders
            </button>
            <h1>Order Details</h1>
            {order ? (
                <div className="order-details">
                    <h2>Order ID: {order.id}</h2>
                    <p>Customer: {order.customerName}</p>
                    <p>Payment Sum: {order.paymentSum} RON</p>
                    <p>Status: {order.status}</p>
                    <p>Date: {new Date(order.dateTime).toLocaleString()}</p>
                    <p>Delivery Method: {order.deliveryMethod}</p>
                    <p>Payment Method: {order.payMethod}</p>
                    <p>Delivery Address: {order.deliveryAddress}</p>
                </div>
            ) : (
                <p>Order not found.</p>
            )}

            <div className="ordered-products">
                <h3>Products in this Order:</h3>
                <ul>
                    {products.map((product) => {
                        const orderedProduct = order.orderedProducts.find(op => op.productId === product.id);
                        return (
                            <li key={product.id} className="product-item">
                                <img
                                    src={`${process.env.PUBLIC_URL}/Products/${product.imageUrls[0]}`}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <span>{product.name}</span>
                                    <span>Quantity: {orderedProduct.quantity}</span>
                                    <span>Price: {orderedProduct.productPrice} RON</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default EmployeeOrderDetails;
