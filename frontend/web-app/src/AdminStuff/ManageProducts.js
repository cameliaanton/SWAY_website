import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Add functions to handle adding, updating, deleting products here

    return (
        <div>
            <h1>Manage Products</h1>
            {/* Render products list and management options here */}
        </div>
    );
};

export default ManageProducts;
