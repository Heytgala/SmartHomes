import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import BASE_URL from './config';

function UpdateProductPopup({ product, onClose, onUpdate }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (product) {
            setFormData({
                productID: product.productID,
                productName: product.productName,
                description: product.description,
                price: product.price,
                image: product.imagePath,
                specialDiscounts: product.discounts,
                ManufacturerName: product.ManufacturerName,
                Rebates: product.Rebates
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
                alert("Product Updated Succesfuly !!");
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
                    <input type="hidden" name="productID" value={formData.productID || ''}></input>
                    <label>
                        Product Name:
                        <input type="text" name="productName" value={formData.productName || ''} onChange={handleChange} disabled />
                    </label>
                    <label>
                        Manufacturer Name:
                        <input
                            type="text"
                            name="ManufacturerName"
                            value={formData.ManufacturerName || ''}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} required></textarea>
                    </label>
                    <div style={{ display: 'flex', gap: '60px' }}>
                        <label>
                            Price:
                            <input type="number" name="price" value={formData.price || ''} onChange={handleChange} required />
                        </label>
                        <label>
                            View Image:
                            <div>
                                {formData.image && <img src={`${BASE_URL}/${formData.image}`} alt="Product" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
                            </div>
                            <input type="hidden" name="image" value={formData.image || ''} />
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: '60px' }}>
                        <label>
                            Special Discounts:
                            <input type="number" name="specialDiscounts" value={formData.specialDiscounts || ''} onChange={handleChange}  />
                        </label>
                        <label>
                            Manufacturer Rebates:
                            <input type="number" name="Rebates" value={formData.Rebates || ''} onChange={handleChange} />
                        </label>
                    </div>
                    
                    <button type="submit">Update</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProductPopup;
