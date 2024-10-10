import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import logo from './images/logo.png';
import BASE_URL from './config';
import UpdateProductPopup from './UpdateProduct';
import AddProductPopup from './AddProduct';
import AddProductAccessoryPopup from './AddProductAccessory';
import InventoryReportPopup from './InventoryReport';
import SalesReportPopup from './SalesReport';

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All'); 
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAddProductPopup, setShowAddProductPopup] = useState(false);
    const [showAddProductAccessoryPopup, setShowAddProductAccessoryPopup] = useState(false);
    const [showSalesReportPopup, setShowSalesReportPopup] = useState(false);
    const [showInventoryReportPopup, setShowInventoryReportPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); 
    const productsPerPage = 4; 
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/productlist`);
                const text = await response.text();
                const data = JSON.parse(text);
                console.log(data);
                const categories = ['All', ...new Set(data.map(product => product.categoryName))];
                
                setProducts(data);
                setCategories(categories); 
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (productName, productID) => {
        try {
            const response = await fetch(`${BASE_URL}/productlist`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName, productID }),
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

    const handleAddProductAccessoryClick = () => {
        setShowAddProductAccessoryPopup(true);
    };
    
    const InventoryReportClick = () => {
        setShowInventoryReportPopup(true);
    };

    const CloseInventoryReportPopup = () => {
        setShowInventoryReportPopup(false);
    };

    const SalesReportClick = () => {
        setShowSalesReportPopup(true);
    };

    const CloseSalesReportPopup = () => {
        setShowSalesReportPopup(false);
    };

    const handleCloseAccessoryPopup = () => {
        setShowAddProductAccessoryPopup(false);
    };

    const handleClosePopup = () => {
        setShowAddProductPopup(false);
    };

    const handleAddProduct = (newProduct) => {
        setProducts(products.filter(product => product.productName === newProduct));
    };

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.categoryName === selectedCategory);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="manager-header">
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
                    <div className="AddButtons">
                        <button className="add-product-button" onClick={SalesReportClick}>Sales Report</button>
                        <button className="add-product-button" onClick={ InventoryReportClick }>Inventory Report</button>
                        <button className="add-product-button" onClick={handleAddProductAccessoryClick}>Add Product Accessory</button>
                        <button className="add-product-button" onClick={handleAddProductClick}>Add New Product</button>
                    </div>
                </div>

                <div className="category-tabs">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedCategory(category);
                                setCurrentPage(1); 
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {showInventoryReportPopup && (
                    <InventoryReportPopup onClose={CloseInventoryReportPopup} />
                )}

                {showSalesReportPopup && (
                    <SalesReportPopup onClose={CloseSalesReportPopup} />
                )}

                {showAddProductPopup && (
                    <AddProductPopup onClose={handleClosePopup} onAddProduct={handleAddProduct} />
                )}

                {showAddProductAccessoryPopup && (
                    <AddProductAccessoryPopup onClose={handleCloseAccessoryPopup} />
                )}

                <div className="product-container">
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product, index) => (
                            <div key={index} className="product-card">
                                <h2 className="Header-product">{product.categoryName}</h2>
                                <img src={`${BASE_URL}/${product.imagePath}`} alt={product.productName} className="product-image" />
                                <h3>{product.productName}</h3>
                                <p>{product.description}</p>
                                <p><strong>Price:</strong> ${product.price}</p>
                                <div className="button-container">
                                    <button className="productbutton1" onClick={() => setSelectedProduct(product)}>Update</button>
                                    <button className="productbutton2" onClick={() => handleDelete(product.productName, product.productID)}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Loading products...</p>
                    )}
                </div>
                <div className="pagination">
                    <button
                        className="page-button"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="page-button"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
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
