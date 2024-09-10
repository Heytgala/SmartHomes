import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import BASE_URL from './config';

function UpdateProductPopup({ product, onClose, onUpdate }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (product) {
            setFormData({
                prevproductname: product.productName,
                productName: product.productName,
                description: product.description,
                price: product.price,
                image: product.image,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/productlist`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            if (result.status === 'success') {
                onUpdate(); 
                onClose();  
            } else {
                console.error('Error updating product:', result.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Update Product</h2>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="prevproductname" value={formData.productName || '' }></input>
                    <label>
                        Product Name:
                        <input type="text" name="productName" value={formData.productName || ''} onChange={handleChange} required />
                    </label>
                    <label>
                        Description:
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} required></textarea>
                    </label>
                    <label>
                        Price:
                        <input type="number" name="price" value={formData.price || ''} onChange={handleChange} required />
                    </label>
                    <label>
                        Image URL:
                        <input type="text" name="image" value={formData.image || ''} onChange={handleChange} />
                    </label>
                    <button type="submit">Update</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProductPopup;
