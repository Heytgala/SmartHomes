import React, { useState, useEffect } from 'react';
import BASE_URL from './config';
import './ProductAccessory.css';
function ProductAccessory({ product, onClose }) {
    const [accessories, setAccessories] = useState([]);
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        if (product && product.productID) {
            fetch(`${BASE_URL}/getAccessories?productID=${product.productID}`)
                .then(response => response.json())
                .then(data => {
                    setAccessories(data);
                })
                .catch(error => {
                    console.error('Error fetching accessories:', error);
                });
        }
    }, [product]);

    const handleBuyAccessoryNow = (accessory, product) => {
        console.log(accessory.accessory_price);
        console.log(product.price);
        fetch(`${BASE_URL}/buyProductAccessory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price: accessory.accessory_price,
                productID: product.productID,
                categoryName: product.categoryName,
                imagePath: accessory.accessoryPath,
                userName: userName,
                accessory_id:accessory.accessory_id,
                accessory_name: accessory.accessory_name

            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to complete purchase');
                }
                return response.json();
            })
            .then(data => {
                alert('Purchase successful! Added to the cart!');
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
    };

    return (
        <div className="productaccessory-popup-overlay">
            <div className="productaccessory-popup-content">
                <button className="trend-close-button" onClick={onClose}>&times;</button>
                <h2>View Accessories for {product.productName}</h2>

                {accessories.length > 0 ? (
                    <div className="accessories-container">
                        {accessories.map(accessory => (
                            <div key={accessory.accessory_id} className="accessory-item">
                                <img src={`${BASE_URL}/${accessory.accessoryPath}`} alt={accessory.accessory_name} className="accessory-image" />
                                <h3>{accessory.accessory_name}</h3>
                                <p>Price: ${parseFloat(accessory.accessory_price).toFixed(2)}</p>
                                <button
                                    className="ProductButton"
                                    type="submit"
                                    onClick={() => handleBuyAccessoryNow(accessory, product)}
                                >
                                    Buy Now
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No accessories available for this product.</p>
                )}
            </div>
        </div>
    );
}

export default ProductAccessory;
