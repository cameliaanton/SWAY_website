import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/manageProducts.css'; // Add appropriate styling
import { FaArrowLeft } from 'react-icons/fa';

const apiBaseURL = 'http://localhost:8080';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/admin/products`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error);
        }
    };

    const filterProducts = () => {
        const query = searchQuery.toLowerCase();
        setFilteredProducts(products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        ));
    };

    const handleAddProduct = () => {
        navigate('/admin/add-product');
    };

    const handleUpdateProduct = (id) => {
        navigate(`/admin/update-product/${id}`);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`${apiBaseURL}/admin/product/${id}`);
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            setError(error);
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="manage-products-container">
            <button className="back-button" onClick={() => navigate('/admin')}>
                <FaArrowLeft /> Back to Admin
            </button>
            <h1>Manage Products</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by Name, Description, Category"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button className="add-product-button" onClick={handleAddProduct}>Add Product</button>
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>
                                <button onClick={() => handleUpdateProduct(product.id)}>Update</button>
                                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;
