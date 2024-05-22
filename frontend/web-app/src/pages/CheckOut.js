import React, { useEffect, useState } from 'react';
import '../styles/checkout.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiBaseURL = 'http://localhost:8080';

function CheckOut({ user }) {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryMethod, setDeliveryMethod] = useState('Store Pickup');
    const [paymentMethod, setPaymentMethod] = useState('Visa');
    const [address, setAddress] = useState('');
    const [products, setProducts] = useState([]);
    const [isOrderItemsVisible, setIsOrderItemsVisible] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        if (user) {
            fetchOrderInProcessing();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!isConfirmed) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        const handleNavigation = async (event) => {
            if (!isConfirmed && !window.confirm('Are you sure you want to leave? You will lose your order and all products will be transferred to the shopping cart.')) {
                event.preventDefault();
            } else {
                await returnItemsToCartAndDeleteOrder();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handleNavigation);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handleNavigation);
        };
    }, [isConfirmed]);

    const fetchOrderInProcessing = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/order/getProcessing/${user.id}`);
            const orderData = response.data;
            setOrder(orderData);
            fetchOrderProducts(orderData.id, orderData);
        } catch (error) {
            console.error("Error fetching order in processing:", error);
            setError(error);
            setLoading(false);
        }
    };

    const fetchOrderProducts = async (orderId, orderData) => {
        try {
            const response = await axios.get(`${apiBaseURL}/order/getProducts/${orderId}`);
            const productsData = response.data;
            const enrichedProducts = productsData.map(product => {
                const orderedProduct = orderData.orderedProducts.find(op => op.productId === product.id);
                return { ...product, quantity: orderedProduct ? orderedProduct.quantity : 0 };
            });
            setProducts(enrichedProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching order products:", error);
            setError(error);
            setLoading(false);
        }
    };

    const handleConfirmOrder = async () => {
        try {
            const response = await axios.put(`${apiBaseURL}/order/confirm/${order.id}`, {
                deliveryMethod,
                paymentMethod,
                address,
                totalPayment: totalWithDelivery,
            });
            if (response.status === 200) {
                setIsConfirmed(true);
                alert('Order confirmed! An email with your order details has been sent.');
                navigate('/home'); // Navigate to home or another page after confirmation
            } else {
                throw new Error('Failed to confirm order');
            }
        } catch (error) {
            console.error("Error confirming order:", error);
            alert('Failed to confirm order.');
        }
    };

    const returnItemsToCartAndDeleteOrder = async () => {
        try {
            await axios.post(`${apiBaseURL}/order/returnToCartAndDeleteOrder/${order.id}`);
            console.log('Items returned to the shopping cart and order deleted.');
        } catch (error) {
            console.error('Error returning items to the cart and deleting the order:', error);
        }
    };

    const calculateDeliveryPrice = () => {
        if (order.paymentSum >= 160) {
            return 0;
        }
        switch (deliveryMethod) {
            case 'Cargus Ship&Go - Online Payment':
                return 14.99;
            case 'FanCourier Collect Point - Online Payment':
                return 14.99;
            case 'Cargus Ship&Go - Payment on Delivery':
                return 18.99;
            case 'FAN Curier Urgent - Online Payment':
                return 21.99;
            default:
                return 0;
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const totalWithDelivery = order.paymentSum + calculateDeliveryPrice();

    return (
        <div className="checkout-container">
            <div className="checkout-content">
                <div className="left-column">
                    <div className="section">
                        <h2>Select Delivery Method</h2>
                        <div className="delivery-options">
                            <label>
                                <input
                                    type="radio"
                                    value="Store Pickup"
                                    checked={deliveryMethod === 'Store Pickup'}
                                    onChange={() => {
                                        setDeliveryMethod('Store Pickup');
                                        setPaymentMethod('Visa');
                                    }}
                                />
                                Store Pickup (Free)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Cargus Ship&Go - Online Payment"
                                    checked={deliveryMethod === 'Cargus Ship&Go - Online Payment'}
                                    onChange={() => {
                                        setDeliveryMethod('Cargus Ship&Go - Online Payment');
                                        setPaymentMethod('Visa');
                                    }}
                                />
                                Cargus Ship&Go - Online Payment (14.99 RON)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="FanCourier Collect Point - Online Payment"
                                    checked={deliveryMethod === 'FanCourier Collect Point - Online Payment'}
                                    onChange={() => {
                                        setDeliveryMethod('FanCourier Collect Point - Online Payment');
                                        setPaymentMethod('Visa');
                                    }}
                                />
                                FanCourier Collect Point - Online Payment (14.99 RON)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Cargus Ship&Go - Payment on Delivery"
                                    checked={deliveryMethod === 'Cargus Ship&Go - Payment on Delivery'}
                                    onChange={() => {
                                        setDeliveryMethod('Cargus Ship&Go - Payment on Delivery');
                                        setPaymentMethod('Payment on Delivery');
                                    }}
                                />
                                Cargus Ship&Go - Payment on Delivery (18.99 RON)
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="FAN Curier Urgent - Online Payment"
                                    checked={deliveryMethod === 'FAN Curier Urgent - Online Payment'}
                                    onChange={() => {
                                        setDeliveryMethod('FAN Curier Urgent - Online Payment');
                                        setPaymentMethod('Visa');
                                    }}
                                />
                                FAN Curier - Online Payment (21.99 RON)
                            </label>
                        </div>
                    </div>
                    <div className="section">
                        <h2>Select Payment Method</h2>
                        <div className="payment-options">
                            {deliveryMethod === 'Cargus Ship&Go - Payment on Delivery' ? (
                                <label>
                                    <input
                                        type="radio"
                                        value="Payment on Delivery"
                                        checked={paymentMethod === 'Payment on Delivery'}
                                        onChange={() => setPaymentMethod('Payment on Delivery')}
                                    />
                                    Payment on Delivery
                                </label>
                            ) : (
                                <>
                                    <label>
                                        <input
                                            type="radio"
                                            value="Visa"
                                            checked={paymentMethod === 'Visa'}
                                            onChange={() => setPaymentMethod('Visa')}
                                        />
                                        Visa
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="Google Pay"
                                            checked={paymentMethod === 'Google Pay'}
                                            onChange={() => setPaymentMethod('Google Pay')}
                                        />
                                        Google Pay
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="Paypal"
                                            checked={paymentMethod === 'Paypal'}
                                            onChange={() => setPaymentMethod('Paypal')}
                                        />
                                        Paypal
                                    </label>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="section">
                        <h2>Select Address</h2>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your address"
                        />
                    </div>
                </div>
                <div className="right-column">
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="price-details">
                            <div className="price-item">
                                <span>Order:</span>
                                <span>{order.paymentSum} RON</span>
                            </div>
                            <div className="price-item">
                                <span>Delivery:</span>
                                <span>{calculateDeliveryPrice()} RON</span>
                            </div>
                            <div className="price-item total">
                                <span>Total:</span>
                                <span>{totalWithDelivery} RON</span>
                            </div>
                        </div>
                        <button className="confirm-button" onClick={handleConfirmOrder}>Cumpară și achită</button>
                    </div>
                    <div className="order-items">
                        <h2 onClick={() => setIsOrderItemsVisible(!isOrderItemsVisible)}>
                            Comanda ta: ({products.length} articole)
                            <span className="toggle-arrow">{isOrderItemsVisible ? '▲' : '▼'}</span>
                        </h2>
                        {isOrderItemsVisible && (
                            <ul className="summary-list">
                                {products.map((product) => (
                                    <li key={product.id} className="summary-item">
                                        <img
                                            src={`${process.env.PUBLIC_URL}/Products/${product.imageUrls[0]}`}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                        <div>
                                            <span>{product.name} ({product.quantity} x {product.price} RON)</span>
                                            <span>{product.quantity * product.price} RON</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckOut;
