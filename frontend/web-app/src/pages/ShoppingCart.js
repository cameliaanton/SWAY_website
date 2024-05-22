import React, { useEffect, useState } from 'react';
import '../styles/shoppingCart.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiBaseURL = 'http://localhost:8080'; // Ensure the base URL matches your backend URL

function ShoppingCart({ user }) {
    const navigate = useNavigate();
    const [cartProducts, setCartProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchShoppingCartProducts();
        } else {
            navigate('/login');
        }
    }, [user]);

    const fetchShoppingCartProducts = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/shoppingCart1/${user.id}`);
            setCartProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching shopping cart products:", error);
            setError(error);
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId, quantity) => {
        try {
            await axios.post(`${apiBaseURL}/shoppingCart/updateQuantity`, {
                cartItemId,
                quantity
            });
            fetchShoppingCartProducts(); // Refresh the cart after update
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleIncrement = (cartItemId, currentQuantity) => {
        updateQuantity(cartItemId, currentQuantity + 1);
    };

    const handleDecrement = (cartItemId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateQuantity(cartItemId, currentQuantity - 1);
        }
    };

    const calculateTotalPrice = () => {
        return cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    const handleOrder = async () => {
        try {
            const response = await axios.post(`${apiBaseURL}/createOrder/${user.id}`);
            if (response.status === 201) {
                alert('Order placed successfully!');
                navigate('/checkout'); // Navigate to checkout page
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert('Failed to place order.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="shopping-cart-container">
            <div className="shopping-cart">
                <h1>Shopping Cart</h1>
                {cartProducts.length === 0 ? (
                    <p>No products in the shopping cart.</p>
                ) : (
                    <ul className="product-list">
                        {cartProducts.map((product) => (
                            <li key={product.id} className="product-item">
                                {product.product.imageUrls && product.product.imageUrls.length > 0 ? (
                                    <img
                                        src={`${process.env.PUBLIC_URL}/Products/${product.product.imageUrls[0]}`}
                                        alt={product.product.name}
                                        className="product-image"
                                    />
                                ) : (
                                    <div className="no-image">No image available</div>
                                )}
                                <div className="product-details">
                                    <h2>{product.product.name}</h2>
                                    <p>Price: {product.price} RON</p>
                                    <div className="quantity-control">
                                        <button onClick={() => handleDecrement(product.id, product.quantity)}>-</button>
                                        <p>Quantity: {product.quantity}</p>
                                        <button onClick={() => handleIncrement(product.id, product.quantity)}>+</button>
                                    </div>
                                    <p>Size: {product.size}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="order-summary">
                <h2>Order Summary</h2>
                <ul className="summary-list">
                    {cartProducts.map((product) => (
                        <li key={product.id} className="summary-item">
                            <span>{product.product.name} ({product.quantity} x {product.price} RON)</span>
                            <span>{product.quantity * product.price} RON</span>
                        </li>
                    ))}
                </ul>
                <div className="total-price">
                    <h3>Total: {calculateTotalPrice()} RON</h3>
                </div>
                <button className="order-button" onClick={handleOrder}>Place Order</button>
            </div>
        </div>
    );
}

export default ShoppingCart;
