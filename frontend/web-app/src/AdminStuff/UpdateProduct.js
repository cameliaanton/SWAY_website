import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/updateProduct.css'; // Add appropriate styling

const apiBaseURL = 'http://localhost:8080';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        gender: '',
        category: '',
        subCategories: [],
        imageUrls: [],
        color: '',
        inventories: [{ size: '', quantity: '' }]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${apiBaseURL}/admin/product/${id}`);
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product:", error);
            setError(error);
            setLoading(false);
        }
    };

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

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${apiBaseURL}/admin/product/${id}`, product);
            navigate('/admin/manage-products');
        } catch (error) {
            console.error("Error updating product:", error);
            setError(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleAddSubCategory = () => {
        setProduct({ ...product, subCategories: [...product.subCategories, ''] });
    };

    const handleAddImageUrl = () => {
        setProduct({ ...product, imageUrls: [...product.imageUrls, ''] });
    };

    const handleAddInventory = () => {
        setProduct({ ...product, inventories: [...product.inventories, { size: '', quantity: '' }] });
    };

    return (
        <div className="update-product-container">
            <h1>Update Product</h1>
            <form onSubmit={handleUpdateProduct}>
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
                    <div className="dynamic-inputs">
                        {product.subCategories.map((subCategory, index) => (
                            <input
                                key={index}
                                type="text"
                                value={subCategory}
                                onChange={(e) => handleArrayChange(e, index, 'subCategories')}
                            />
                        ))}
                    </div>
                    <button type="button" onClick={handleAddSubCategory}>Add SubCategory</button>
                </div>
                <div className="form-group">
                    <label>Image URLs</label>
                    <div className="dynamic-inputs">
                        {product.imageUrls.map((url, index) => (
                            <input
                                key={index}
                                type="text"
                                value={url}
                                onChange={(e) => handleArrayChange(e, index, 'imageUrls')}
                            />
                        ))}
                    </div>
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
                <div className="form-group">
                    <label>Inventories</label>
                    <div className="dynamic-inputs">
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
                    </div>
                    <button type="button" onClick={handleAddInventory}>Add Inventory</button>
                </div>
                <button type="submit">Update Product</button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default UpdateProduct;
