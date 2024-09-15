import React, { useState, useEffect } from 'react';
import BASE_URL from './config';
import './ProductDisplay.css';

function SmartDoorbells() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 3;
    const userName = localStorage.getItem('userName');
    const [selectedDiscounts, setSelectedDiscounts] = useState({});


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

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const handleBuyNow = (product) => {
        const isDiscountSelected = selectedDiscounts[product.productName];
        fetch(`${BASE_URL}/buyProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: product.productName,
                price: product.price,
                description: product.description,
                userName: userName,
                ...(isDiscountSelected && product.specialDiscounts ? { specialDiscount: product.specialDiscounts } : {})
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

    const handleCheckboxChange = (productName) => {
        setSelectedDiscounts((prevSelected) => ({
            ...prevSelected,
            [productName]: !prevSelected[productName],
        }));
    };


    return (
        <div>
            <div className="products-container">
                {Array.isArray(currentProducts) && currentProducts.length > 0 ? (
                    currentProducts.map(product => (
                        <div key={product.name} className="prod-container">
                            <img src={`${BASE_URL}/${product.image}`} alt={product.name} className="prod-image" />
                            <h2 className="prod-name">{product.productName}</h2>
                            <p className="prod-description">{product.description}</p>
                            <p className="prod-price">${parseFloat(product.price).toFixed(2)}</p>
                            {product.specialDiscounts && (
                                <div className="discount-checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={!!selectedDiscounts[product.productName]}
                                            onChange={() => handleCheckboxChange(product.productName)}
                                        />
                                        Select Retailer Special Discount: ${product.specialDiscounts}
                                    </label>
                                </div>
                            )}
                            <div className="Button-Container">
                                <button
                                    className="ProductButton"
                                    type="submit"
                                    onClick={() => handleBuyNow(product)}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
            <div className="pagination-controls">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={index + 1 === currentPage ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SmartDoorbells;
