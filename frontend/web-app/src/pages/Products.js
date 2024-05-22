import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/products.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons

const apiBaseURL = 'http://localhost:8080';

function Products({ user }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('default');
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const gender = location.state?.gender || 'all';

    useEffect(() => {
        handleProducts();
        if (user) {
            fetchFavoriteProducts();
        }
    }, [gender, user]);

    const handleProducts = async () => {
        try {
            const endpoint = gender === 'all' ? `${apiBaseURL}/allProducts` : `${apiBaseURL}/products/${gender}`;
            const response = await axios.get(endpoint);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error);
            setLoading(false);
        }
    };

    const fetchFavoriteProducts = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/favorites/${user.id}`);
            setFavoriteProducts(response.data.map(fp => fp.productId));
        } catch (error) {
            console.error("Error fetching favorite products:", error);
        }
    };

    const sortProducts = async () => {
        let endpoint;
        switch (sortOption) {
            case 'asc':
                endpoint = 'product/asc';
                break;
            case 'desc':
                endpoint = 'product/desc';
                break;
            case 'random':
                endpoint = 'product/random';
                break;
            default:
                handleProducts();
                return;
        }

        try {
            const response = await axios.post(`${apiBaseURL}/${endpoint}`, products);
            setProducts(response.data);
        } catch (error) {
            console.error(`Error sorting products (${sortOption}):`, error);
        }
    };

    const toggleFavorite = async (productId) => {
        if (!user) {
            alert('You need to be logged in to add products to favorites.');
            navigate('/login');
            return;
        }

        if (favoriteProducts.includes(productId)) {
            try {
                await axios.delete(`${apiBaseURL}/favorites`, {
                    data: {
                        userId: user.id,
                        productId: productId
                    }
                });
                setFavoriteProducts(favoriteProducts.filter(id => id !== productId));
            } catch (error) {
                console.error("Error removing from favorites:", error);
            }
        } else {
            try {
                await axios.post(`${apiBaseURL}/favorites`, {
                    userId: user.id,
                    productId: productId
                });
                setFavoriteProducts([...favoriteProducts, productId]);
            } catch (error) {
                console.error("Error adding to favorites:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const navigateToProductPage = (id) => {
        navigate(`/product/${id}`);
    };

    return (
        <div className='products'>
            <h1 className='productsTitle'>Our Products</h1>
            <div className='filter'>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="random">Ordine Implicita</option>
                    <option value="asc">Sort Ascending</option>
                    <option value="desc">Sort Descending</option>
                </select>
                <button onClick={sortProducts}>Filter</button>
            </div>
            <div className='productsList'>
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className='productItem'>
                            <div className='productImages' onClick={() => navigateToProductPage(product.id)}>
                                <img
                                    src={`${process.env.PUBLIC_URL}/Products/${product.imageUrls[0]}`}
                                    alt={product.name}
                                />
                            </div>
                            <div className='productInfo'>
                                <h2>{product.name}</h2>
                                <p>Price: {product.price} RON</p>
                                <button
                                    className='favoriteButton'
                                    onClick={() => toggleFavorite(product.id)}
                                >
                                    {favoriteProducts.includes(product.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No products available</div>
                )}
            </div>
        </div>
    );
}

export default Products;
