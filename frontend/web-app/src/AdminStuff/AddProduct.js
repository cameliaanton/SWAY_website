import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/addProduct.css'; // Add appropriate styling

const apiBaseURL = 'http://localhost:8080';

const AddProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        gender: '',
        category: '',
        subCategories: [],
        newSubCategory: '', // To handle adding a new subcategory
        imageUrls: [],
        color: '',
        inventories: [{ size: '', quantity: '' }]
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleArrayChange = (e, index, key) => {
        const { value } = e.target;
        const newArray = [...product[key]];
        newArray[index] = value;
        setProduct({ ...product, [key]: newArray });
    };

    const handleInventoryChange = (e, index) => {
        const { name, value } = e.target;
        const newInventories = [...product.inventories];
        newInventories[index][name] = value;
        setProduct({ ...product, inventories: newInventories });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiBaseURL}/admin/addProduct`, product);
            navigate('/admin/manage-products');
        } catch (error) {
            console.error("Error adding product:", error);
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    const handleAddSubCategory = () => {
        if (product.newSubCategory && !product.subCategories.includes(product.newSubCategory)) {
            setProduct({
                ...product,
                subCategories: [...product.subCategories, product.newSubCategory],
                newSubCategory: ''
            });
        }
    };

    const handleAddImageUrl = () => {
        setProduct({ ...product, imageUrls: [...product.imageUrls, ''] });
    };

    const handleAddInventory = () => {
        setProduct({ ...product, inventories: [...product.inventories, { size: '', quantity: '' }] });
    };

    return (
        <div className="add-product-container">
            <h1>Add New Product</h1>
            <form onSubmit={handleAddProduct}>
                <div className="product-details">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="name" value={product.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" name="description" value={product.description} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" name="price" value={product.price} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select name="gender" value={product.gender} onChange={handleInputChange} required>
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="UNISEX">Unisex</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={product.category} onChange={handleInputChange} required>
                            <option value="">Select Category</option>
                            <option value="T_SHIRT">T-Shirt</option>
                            <option value="DRESS">Dress</option>
                            <option value="PANTS">Pants</option>
                            <option value="ACCESSORIES">Accessories</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>SubCategories</label>
                        <div className="subcategory-list">
                            {product.subCategories.map((subCategory, index) => (
                                <span key={index} className="subcategory-item">
                                    {subCategory}
                                </span>
                            ))}
                        </div>
                        <select name="newSubCategory" value={product.newSubCategory} onChange={handleInputChange}>
                            <option value="">Select SubCategory</option>
                            <option value="OVERSIZE">Oversize</option>
                            <option value="FIT">Fit</option>
                            <option value="OFF_SHOULDER">Off Shoulder</option>
                            <option value="TURTLE_NECK">Turtle Neck</option>
                            <option value="OTHERS">Others</option>
                        </select>
                        <button type="button" onClick={handleAddSubCategory}>Add SubCategory</button>
                    </div>
                    <div className="form-group">
                        <label>Image URLs</label>
                        {product.imageUrls.map((url, index) => (
                            <input
                                key={index}
                                type="text"
                                value={url}
                                onChange={(e) => handleArrayChange(e, index, 'imageUrls')}
                            />
                        ))}
                        <button type="button" onClick={handleAddImageUrl}>Add Image URL</button>
                    </div>
                    <div className="form-group">
                        <label>Color</label>
                        <select name="color" value={product.color} onChange={handleInputChange} required>
                            <option value="">Select Color</option>
                            <option value="BLACK">Black</option>
                            <option value="WHITE">White</option>
                            <option value="RED">Red</option>
                            <option value="BLUE">Blue</option>
                            <option value="GREEN">Green</option>
                            <option value="GREY">Grey</option>
                        </select>
                    </div>
                </div>
                <div className="inventory-management">
                    <div className="form-group">
                        <label>Inventories</label>
                        {product.inventories.map((inventory, index) => (
                            <div key={index} className="inventory-item">
                                <select name="size" value={inventory.size} onChange={(e) => handleInventoryChange(e, index)} required>
                                    <option value="">Select Size</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={inventory.quantity}
                                    onChange={(e) => handleInventoryChange(e, index)}
                                    required
                                />
                            </div>
                        ))}
                        <button type="button" onClick={handleAddInventory}>Add Inventory</button>
                    </div>
                </div>
                <button type="submit">Add Product</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default AddProduct;
