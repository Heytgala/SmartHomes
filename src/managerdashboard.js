import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import logo from './images/logo.png';
import BASE_URL from './config';
import UpdateProductPopup from './UpdateProduct';
import AddProductPopup from './AddProduct'; 


function scrollContainer(direction) {
    const container = document.querySelector('.product-container');
    const containerWidth = container.offsetWidth; 
    container.scrollBy({
        left: direction * containerWidth,
        behavior: 'smooth'
    });
}


function Dashboard() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAddProductPopup, setShowAddProductPopup] = useState(false);
    const userName = localStorage.getItem('userName');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/productlist`);
                const text = await response.text();
                const data = JSON.parse(text);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (productName) => {
        try {
            const response = await fetch(`${BASE_URL}/productlist`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            if (result.status === 'success') {
                setProducts(products.filter(product => product.productName !== productName));
            } else {
                console.error('Error deleting product:', result.message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleUpdate = () => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/productlist`);
                const text = await response.text();
                console.log('Raw Response:', text);
                const data = JSON.parse(text);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData();
    };

    const handleAddProductClick = () => {
        setShowAddProductPopup(true);
    };
    const handleClosePopup = () => {
        setShowAddProductPopup(false);
    };

    return (
        <div>
            <div className="header">
                <div className="header-left">
                    <img src={logo} className="logo" alt="Smart Homes Logo" />
                    <p>Smart Homes</p>
                    <br />
                </div>
                <div className="menu-right">
                    <p className="user-name">Welcome, {userName}</p>
                </div>
            </div>

            <div className="product-list">
                <div className="title-container">
                    <h1>Product List</h1>
                    <button className="add-product-button" onClick={handleAddProductClick}>Add New Product</button>
                </div>
                <button className="scroll-arrow scroll-arrow-left" onClick={() => scrollContainer(-1)}>
                    &lt;
                </button>
                {showAddProductPopup && (
                    <AddProductPopup onClose={handleClosePopup} />
                )}
                <div className="product-container">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <div key={index} className="product-card">
                                <h2 className="Header-product">{product.categoryName}</h2>
                                <img src={`${BASE_URL}/${product.image}`} alt={product.productName} className="product-image" />
                                <h3>{product.productName}</h3>
                                <p>{product.description}</p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <div className="button-container">
                                    <button className="productbutton1" onClick={() => setSelectedProduct(product)}>Update</button>
                                    <button className="productbutton2" onClick={() => handleDelete(product.productName)}>Delete</button>
                                </div>
                               
                            </div>
                        ))
                    ) : (
                        <p>Loading products...</p>
                    )}
                </div>
                <button className="scroll-arrow scroll-arrow-right" onClick={() => scrollContainer(1)}>
                    &gt;
                </button>
            </div>
            {selectedProduct && (
                <UpdateProductPopup
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}

export default Dashboard;
