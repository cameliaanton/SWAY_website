import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/Home.css';

function Home({ user }) {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/allProducts')
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const groupedProducts = chunkArray(products, 4); // Group products into sets of 3

    const navigateToProductPage = (id) => {
        navigate(`/product/${id}`);
    };

    const navigateToProductsPage = (gender) => {
        navigate('/products', { state: { gender, user } });
    };

    return (
        <div className="home">
            <div className="homeImageContainer">
                <img
                    src={`${process.env.PUBLIC_URL}/image.webp`}
                    alt="Stylish young man and woman posing together"
                    className="homeImage"
                />
                <div className="headerContainer">
                    <h1>Welcome to the Sway</h1>
                    {user ? (
                        <div>
                            <h2>Hello, {user.name}</h2>
                        </div>
                    ) : (
                        <div className='Hello'>
                            <h2>Hello, Guest</h2>
                        </div>
                    )}
                    <div className="buttonContainer">
                        <button onClick={() => navigateToProductsPage('FEMALE')}>For Her</button>
                        <button onClick={() => navigateToProductsPage('MALE')}>For Him</button>
                    </div>
                </div>
            </div>
            <div className="productSection">
                <Carousel
                    showArrows={true}
                    showThumbs={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={3000}
                    emulateTouch={true}
                >
                    {groupedProducts.map((group, index) => (
                        <div key={index} className="custom-slide">
                            {group.map((product) => (
                                <div className="productItem" key={product.id} onClick={() => navigateToProductPage(product.id)}>
                                    <img src={`${process.env.PUBLIC_URL}/Products/${product.imageUrls[0]}`} alt={product.name} />
                                    <div className="overlay">
                                        <p className="product-name">{product.name}</p>
                                        <p className="product-price">{product.price} RON</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}

export default Home;
