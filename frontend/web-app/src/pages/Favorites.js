import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/products.css';

const apiBaseURL = 'http://localhost:8080';

function Favorites() {
    const location = useLocation();
    const user = location.state?.user;
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchFavoriteProducts();
        } else {
            navigate('/login');
        }
    }, [user]);

    const fetchFavoriteProducts = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/favorites1/${user.id}`);
            setFavoriteProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching favorite products:", error);
            setError(error);
            setLoading(false);
        }
    };

    const navigateToProductPage = (id) => {
        navigate(`/product/${id}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='products'>
            <h1 className='productsTitle'>Your Favorite Products</h1>
            <div className='productsList'>
                {favoriteProducts.length > 0 ? (
                    favoriteProducts.map((favorite) => (
                        <div key={favorite.productId} className='productItem'>
                            <div className='productImages' onClick={() => navigateToProductPage(favorite.productId)}>
                                <img
                                    src={`${process.env.PUBLIC_URL}/Products/${favorite.product.imageUrls[0]}`}
                                    alt={favorite.product.name}
                                />
                            </div>
                            <div className='productInfo'>
                                <h2>{favorite.product.name}</h2>
                                <p>Price: {favorite.product.price} RON</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No favorite products available</div>
                )}
            </div>
        </div>
    );
}

export default Favorites;
