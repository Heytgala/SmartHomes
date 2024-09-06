import React from 'react';
import productsData from './database/Productdetails.json';

function SmartDoorbells() {
    const doorbellsCategory = productsData.categories.find(category => category.categoryName === 'Smart Doorbells');
    const products = doorbellsCategory ? doorbellsCategory.products : [];
    return (
        <div>
            <h1>Welcome to Smart Doorbells</h1>
            <p>Here you'll find all our smart home products and more!</p>
            <div className="products-container">
                {products.map(product => (
                  <div key={product.name} className="product-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <h2 className="product-name">{product.name}</h2>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                  </div>
                ))}
            </div>
        </div>
    );
}

export default SmartDoorbells;