import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/userOrders.css';

const apiBaseURL = 'http://localhost:8080';

function UserOrders({ user }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchUserOrders();
        } else {
            setLoading(false);
            setError('User not logged in.');
        }
    }, [user]);

    const fetchUserOrders = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/orders/${user.id}`);
            const ordersData = response.data;

            const ordersWithProducts = await Promise.all(
                ordersData.map(async (order) => {
                    const productsResponse = await axios.get(`${apiBaseURL}/order/getProducts/${order.id}`);
                    return { ...order, products: productsResponse.data };
                })
            );

            setOrders(ordersWithProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user orders:", error);
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
        <div className="user-orders-container">
            <h1>My Orders</h1>
            {orders.length === 0 ? (
                <div>No orders found.</div>
            ) : (
                <ul className="orders-list">
                    {orders.map((order) => (
                        <li key={order.id} className="order-item">
                            <div className="order-header">
                                <span>Order ID: {order.id}</span>
                                <span>Date: {new Date(order.dateTime).toLocaleDateString()}</span>
                            </div>
                            <div className="order-details">
                                <p>Delivery Method: {order.delivery_method}</p>
                                <p>Payment Method: {order.payMethod}</p>
                                <p>Address: {order.deliveryAddress}</p>
                                <p>Status: {order.status}</p>
                                <p>Total Payment: {order.paymentSum} RON</p>
                            </div>
                            <div className="ordered-products">
                                <h3>Products:</h3>
                                <ul>
                                    {order.products.map((product) => {
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserOrders;
