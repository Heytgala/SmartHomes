import React, { useState, useEffect } from 'react';
import BASE_URL from './config';
import './ProductDisplay.css';

function SmartDoorbells() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        fetch(`${BASE_URL}/productlist?categoryName=Smart%20Speaker`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Category not found');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data || []);
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

    const handleBuyNow = (product) => {
        fetch(`${BASE_URL}/buyProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: product.productName,
                price: product.price,
                description: product.description,
                userName: userName
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
        <div>
            <div className="products-container">
                {Array.isArray(products) && products.length > 0 ? (
                    products.map(product => (
                        <div key={product.name} className="prod-container">
                            <img src={`${BASE_URL}/${product.image}`} alt={product.name} className="prod-image" />
                            <h2 className="prod-name">{product.productName}</h2>
                            <p className="prod-description">{product.description}</p>
                            <p className="prod-price">${parseFloat(product.price).toFixed(2)}</p>
                            <div className="Button-Container">
                                <button
                                    className="ProductButton"
                                    type="submit"
                                    onClick={() => handleBuyNow(product)}
                                >
                                    Buy Now
                                </button>
                                <button className="ViewProduct" type="submit">View Product</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>

        </div>
    );
}

export default SmartDoorbells;
