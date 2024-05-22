import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/productPage.css';

const apiBaseURL = 'http://localhost:8080';

function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [colorProducts, setColorProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sizeProducts, setSizeProducts] = useState(null);
    const [showDescription, setShowDescription] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [user, setUser] = useState(null); // Retrieve the logged-in user from cookies or state

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/product/${id}`);
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product:", error);
            setError(error);
            setLoading(false);
        }
    };

    const fetchColorProducts = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/product/color/${id}`);
            setColorProducts(Object.values(response.data));
        } catch (error) {
            console.error("Error fetching color products:", error);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchColorProducts();
        const storedUser = JSON.parse(document.cookie.split('; ').find(row => row.startsWith('user=')).split('=')[1]);
        setUser(storedUser);
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleColorClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleSizeClick = (size) => {
        setSizeProducts(size);
    };

    const retractDescription = () => {
        setShowDescription(!showDescription);
    };

    const handleAddToCart = async () => {
        if (!sizeProducts) {
            alert("Please select a size before adding to cart");
            return;
        }

        try {
            await axios.post(`${apiBaseURL}/shoppingCart`, {
                userId: user.id,
                productId: product.id,
                quantity: 1, // Default quantity to 1
                size: sizeProducts
            });
            alert("Product added to cart successfully");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error adding to cart");
        }
    };

    const handleImageChange = (direction) => {
        if (direction === 'left') {
            setSelectedImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : product.imageUrls.length - 1));
        } else if (direction === 'right') {
            setSelectedImageIndex((prevIndex) => (prevIndex < product.imageUrls.length - 1 ? prevIndex + 1 : 0));
        }
    };

    const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

    return (
        <div className='product-page'>
            {product ? (
                <div className='product-details'>
                    <div className='image-gallery'>
                        <div className='thumbnails'>
                            {product.imageUrls && product.imageUrls.map((url, index) => (
                                <img key={index} src={`${process.env.PUBLIC_URL}/Products/${url}`} alt={product.name}
                                    className={selectedImageIndex === index ? 'selected' : ''}
                                    onClick={() => setSelectedImageIndex(index)}
                                />
                            ))}
                        </div>
                        <div className='main-image-container'>
                            <div className='main-image'>
                                <img
                                    src={`${process.env.PUBLIC_URL}/Products/${product.imageUrls[selectedImageIndex]}`}
                                    alt={product.name}
                                    onClick={(e) => {
                                        const rect = e.target.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        if (x < rect.width / 2) {
                                            handleImageChange('left');
                                        } else {
                                            handleImageChange('right');
                                        }
                                    }}
                                />
                            </div>
                            <div className='description-bar' onClick={retractDescription}>
                                <span>DESCRIERE</span>
                                <span className='toggle-icon'>{showDescription ? '▲' : '▼'}</span>
                            </div>
                            <div className={`description ${showDescription ? 'expanded' : 'collapsed'}`}>
                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className='product-info'>
                        <h1>{product.name}</h1>
                        <p className='price'>{product.price} RON</p>
                        <div className='color-options'>
                            <label>Other Color:</label>
                            {colorProducts.map((colorProduct) => (
                                <div key={colorProduct.id} className='color-option' onClick={() => handleColorClick(colorProduct.id)}>
                                    <label style={{ backgroundColor: colorProduct.color }}></label>
                                </div>
                            ))}
                        </div>
                        <div className='size-options'>
                            <label>Size:</label>
                            {sizeOptions.map((size) => {
                                const available = product.inventories.some(item => item.size === size && item.quantity > 0);
                                return (
                                    <button key={size}
                                        disabled={!available}
                                        className={available ? (sizeProducts === size ? 'selected' : '') : 'disabled'}
                                        onClick={() => handleSizeClick(size)}>
                                        {size}
                                    </button>
                                );
                            })}
                        </div>
                        <button className='add-to-cart' onClick={handleAddToCart}>ADAUGĂ ÎN COȘ</button>
                        <div className='additional-info'>
                            <p>Retururi Gratuite</p>
                            <p>Livrare gratuită</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Product not found</div>
            )}
        </div>
    );
}

export default ProductPage;
