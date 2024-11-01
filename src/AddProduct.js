import React, { useState, useEffect } from 'react';
import BASE_URL from './config';

function AddProductPopup({ onClose, onAddProduct }) {
    const [productName, setProductName] = useState('');
    const [ManufacturerName, setManufacturerName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null); 
    const [categoryName, setCategory] = useState('');
    const [specialDiscounts, setSpecialDiscounts] = useState('');
    const [Rebates, setRebates] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/CategoryServlet`);
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleAddProduct = async (event) => {
        event.preventDefault();

        if (!productName || !ManufacturerName || !description || !price || !image || !categoryName ) {
            alert('Please fill out all required fields.');
            return;
        }
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('ManufacturerName', ManufacturerName);
        formData.append('categoryName', categoryName);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', image); 
        formData.append('specialDiscounts', specialDiscounts || '');
        formData.append('Rebates', Rebates);

        try {
            const response = await fetch(`${BASE_URL}/productlist`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            if (result.status === 'success') {
                alert('Product Added Successfully');
                onAddProduct(result.productName);
                onClose();
            } else {
                console.error('Error adding product:', result.message);
            }
        } catch (error) {
            alert('Error adding product');
            console.error(error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>New Product</h2>
                <form onSubmit={handleAddProduct} encType="multipart/form-data">
                    <label>
                        Category:
                        <select
                            value={categoryName}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Product Name:
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Manufacturer Name:
                        <input
                            type="text"
                            value={ManufacturerName}
                            onChange={(e) => setManufacturerName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <div style={{ display: 'flex', gap: '60px' }}>
                        <label>
                            Price:
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            Image:
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                required
                            />
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: '60px' }}>
                        <label>
                            Retailer Special Discounts:
                            <input
                                type="number"
                                value={specialDiscounts}
                                onChange={(e) => setSpecialDiscounts(e.target.value)}
                            />
                        </label>
                        <label>
                            Manufacturer Rebates:
                            <input
                                type="number"
                                value={Rebates}
                                onChange={(e) => setRebates(e.target.value)}                           
                            />
                        </label>
                    </div>
                    

                    <button type="submit">Add Product</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default AddProductPopup;
