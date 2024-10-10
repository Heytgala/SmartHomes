import React, { useState, useEffect } from 'react';
import BASE_URL from './config';

function AddProductPopup({ onClose, onAddProduct }) {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [AccessoryName, setAccessoryName] = useState('');
    const [image, setImage] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = () => {
            fetch(`${BASE_URL}/productlist`)
                .then(response => response.json())
                .then(data => {
                    setProducts(data);
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        };
        fetchProducts();
    }, []);

    const handleAddProductAccessory = async (event) => {
        event.preventDefault();

        if (!productName || !price || !image || !AccessoryName) {
            alert('Please fill out all required fields.');
            return;
        }
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('AccessoryName', AccessoryName);
        formData.append('price', price);
        formData.append('image', image);

        try {
            const response = await fetch(`${BASE_URL}/productaccessorylist`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            if (result.status === 'success') {
                alert('Product Accessory Added Successfully');
                onClose();
            } else {
                console.error('Error adding product accessory:', result.message);
            }
        } catch (error) {
            alert('Error adding product accessory');
            console.error(error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>New Product Accessory</h2>
                <form onSubmit={handleAddProductAccessory} encType="multipart/form-data">
                    <label>
                        Product Name:
                        <select
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            required
                        >
                            <option value="">Select a Product</option>
                            {products.map((product, index) => (
                                <option key={index} value={product.productID}>
                                    {product.productName}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Accessory Name:
                        <input
                            type="text"
                            value={AccessoryName}
                            onChange={(e) => setAccessoryName(e.target.value)}
                            required
                        />
                    </label>
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
                    <button type="submit">Add Accessory</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default AddProductPopup;
