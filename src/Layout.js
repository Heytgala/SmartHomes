import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import './layout.css';
import './global.css';
import logo from './images/logo.png';
import { FaShoppingCart, FaChevronDown } from 'react-icons/fa';
import BASE_URL from './config';
import CartModal from './CartModal';
import CheckoutModal from './CheckoutModal';
import OrdersModal from './OrderModal';

function Layout() {
    const location = useLocation();
    const name = location.state?.name;
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSection, setExpandedSection] = useState(null);
    const [productData, setProductData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');
    const [cartItems, setCartItems] = useState([]);



    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/productlist`);
                const data = await response.json();
                setProductData(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };
        fetchProductData();
    }, []);

    useEffect(() => {
        const filterProducts = () => {
            if (!searchTerm) {
                setFilteredProducts(productData);
                setShowSearchResults(false);
                return;
            }
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = productData.filter(product =>
                product.productName.toLowerCase().includes(lowercasedSearchTerm) ||
                product.categoryName.toLowerCase().includes(lowercasedSearchTerm)
            );
            setFilteredProducts(filtered);
            setShowSearchResults(filtered.length > 0); 
        };
        filterProducts();
    }, [searchTerm, productData]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleNavigation = (path) => {
        navigate(path, { state: { name } });
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const categorizeProducts = (category) => {
        return filteredProducts
            .filter(product => product.categoryName === category)
            .map(product => (
                <li key={product.productName} onClick={() => handleNavigation(categoryPaths[category])}>
                    {product.productName}
                </li>
            ));
    };

    const categoryPaths = {
        'Smart Doorbells': '/main/smartdoorbells',
        'Smart Doorlocks': '/main/smartdoorlock',
        'Smart Speaker': '/main/smartspeaker',
        'Smart Lighting': '/main/smartlighting',
        'Smart Thermostats': '/main/smartthermostats',
    };

    const handleCartClick = async () => {
        try {
            const response = await fetch(`${BASE_URL}/buyProduct?userName=${userName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const text = await response.text();
            console.log('Raw response text:', text);

            if (text && text.trim().length > 0) {
                try {
                    const data = JSON.parse(text);

                    // Handle case where cart is empty
                    if (Array.isArray(data) && data.length === 0) {
                        console.log('Cart is empty');
                        setCartItems([]); // Empty cart
                        setShowCartModal(true);
                    } else if (Array.isArray(data)) {
                        // Populate cart with items if present
                        const updatedCartItems = data.map(item => ({
                            ...item,
                            quantity: 1, // Assuming default quantity is 1
                            price: parseFloat(item.price)
                        }));
                        setCartItems(updatedCartItems);
                        setShowCartModal(true);
                    } else {
                        console.error('Unexpected JSON structure:', data);
                    }
                } catch (jsonError) {
                    console.error('Error parsing JSON:', jsonError, 'Raw text:', text);
                }
            } else {
                // Handle empty or invalid response from the server
                console.log('Cart is empty or response invalid');
                setCartItems([]); // Set cart to empty
                setShowCartModal(true); // Show the modal indicating the cart is empty
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };


    /*
    const handleCartClick = async () => {
        try {
            const response = await fetch(`${BASE_URL}/buyProduct?userName=${userName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const text = await response.text();
            console.log('Raw response text:', text);

            let jsonData;
            if (text.startsWith('{')) {
                jsonData = `[${text}]`; 
            } else {
                jsonData = text; 
            }

            const data = JSON.parse(jsonData);

            if (response.ok) {
                const updatedCartItems = data.map(item => ({
                    ...item,
                    quantity: 1, 
                    price: parseFloat(item.price)
                }));
                setCartItems(updatedCartItems);
                setShowCartModal(true);
            } else {
                console.error('Error fetching cart data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };
    */

    const closeCartModal = () => {
        setShowCartModal(false);
    };

    const closeCheckoutModal = () => {
        setShowCheckoutModal(false); 
    };

    const handleCheckoutClick = () => {
        setShowCartModal(false); 
        setShowCheckoutModal(true); 
        setCartItems(cartItems);
    };

    const handleCheckoutSubmit = (customerInfo) => {
        setCartItems([]);
    };

    const handleViewOrdersClick = () => {
        setShowOrdersModal(true);
    };

    const closeOrdersModal = () => {
        setShowOrdersModal(false);
    };


    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };


    const handleRemoveItem = async (productName) => {
        try {
            const ProductName = encodeURIComponent(productName);
            const response = await fetch(`${BASE_URL}/buyProduct?userName=${userName}&productName=${ProductName}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const updatedCart = cartItems.filter(item => item.productName !== productName);
                setCartItems(updatedCart);
            } else {
                console.error('Error removing item from the server:', response.statusText);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(cartItems.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <div className="header">
                <div className="header-left">
                    <img src={logo} className="logo" alt="Smart Homes Logo" />
                    <p>Smart Homes</p>
                    <br />
                </div>
                <div className="search-container">
                    <button className="view-order-button" onClick={handleViewOrdersClick}>
                        View Orders
                    </button>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search Products"
                        value={searchTerm}
                        onChange={handleSearch}
                        onFocus={() => setShowSearchResults(true)}
                        onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    />
                    {showSearchResults && (
                        <ul className="search-results-dropdown">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <li key={product.productName} onClick={() => handleNavigation(categoryPaths[product.categoryName])}>
                                        {product.productName}
                                    </li>
                                ))
                            ) : (
                                <li>No results found</li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
            <div className="menu-bar">
                <div className="menu-left">
                    <ul className="menu-list">
                        <li onClick={() => handleNavigation('/main')}>Home</li>
                        <li onClick={() => handleNavigation('/main/smartdoorbells')}>Smart Doorbells</li>
                        <li onClick={() => handleNavigation('/main/smartdoorlock')}>Smart Doorlocks</li>
                        <li onClick={() => handleNavigation('/main/smartspeaker')}>Smart Speakers</li>
                        <li onClick={() => handleNavigation('/main/smartlighting')}>Smart Lightings</li>
                        <li onClick={() => handleNavigation('/main/smartthermostats')}>Smart Thermostats</li>
                    </ul>
                </div>
                <div className="menu-right">
                    <p className="user-name">Welcome, {userName}</p>
                    <FaShoppingCart className="cart-icon" onClick={handleCartClick} />
                </div>
            </div>
            <div className="main-content">
                <div className="left-nav-bar">
                    <ul className="product-list">
                        <li className="menulist" onClick={() => toggleSection('doorbells')}>
                            Smart Doorbells
                            <FaChevronDown className={`dropdown-icon ${expandedSection === 'doorbells' ? 'rotated' : ''}`} />
                        </li>
                        {expandedSection === 'doorbells' && (
                            <ul className="dropdown-list">
                                {categorizeProducts('Smart Doorbells')}
                            </ul>
                        )}
                    </ul>
                    <ul className="product-list">
                        <li className="menulist" onClick={() => toggleSection('doorlocks')}>
                            Smart Doorlocks
                            <FaChevronDown className={`dropdown-icon ${expandedSection === 'doorlocks' ? 'rotated' : ''}`} />
                        </li>
                        {expandedSection === 'doorlocks' && (
                            <ul className="dropdown-list">
                                {categorizeProducts('Smart Doorlocks')}
                            </ul>
                        )}
                    </ul>
                    <ul className="product-list">
                        <li className="menulist" onClick={() => toggleSection('speakers')}>
                            Smart Speakers
                            <FaChevronDown className={`dropdown-icon ${expandedSection === 'speakers' ? 'rotated' : ''}`} />
                        </li>
                        {expandedSection === 'speakers' && (
                            <ul className="dropdown-list">
                                {categorizeProducts('Smart Speaker')}
                            </ul>
                        )}
                    </ul>
                    <ul className="product-list">
                        <li className="menulist" onClick={() => toggleSection('lightings')}>
                            Smart Lightings
                            <FaChevronDown className={`dropdown-icon ${expandedSection === 'lightings' ? 'rotated' : ''}`} />
                        </li>
                        {expandedSection === 'lightings' && (
                            <ul className="dropdown-list">
                                {categorizeProducts('Smart Lighting')}
                            </ul>
                        )}
                    </ul>
                    <ul className="product-list">
                        <li className="menulist" onClick={() => toggleSection('thermostats')}>
                            Smart Thermostats
                            <FaChevronDown className={`dropdown-icon ${expandedSection === 'thermostats' ? 'rotated' : ''}`} />
                        </li>
                        {expandedSection === 'thermostats' && (
                            <ul className="dropdown-list">
                                {categorizeProducts('Smart Thermostats')}
                            </ul>
                        )}
                    </ul>
                </div>
                <div className="content">
                    <Outlet />
                </div>
            </div>
            <CartModal show={showCartModal} onClose={closeCartModal}>
                <h2>Your Cart</h2>
                {cartItems.length > 0 || cartItems!==[] ? (
                    <>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.productName}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button className="RemoveButton" onClick={() => handleRemoveItem(item.productName,index)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination-controls">
                            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <span>Page {currentPage}</span>
                            <button onClick={handleNextPage} disabled={currentPage === Math.ceil(cartItems.length / itemsPerPage)}>
                                Next
                            </button>
                        </div>
                        <div className="cart-total">
                            <h3>Total: ${calculateTotal()}</h3>
                            <button className="checkout-button" onClick={handleCheckoutClick}>Checkout</button>
                        </div>
                    </>
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </CartModal>
            <CheckoutModal show={showCheckoutModal} onClose={closeCheckoutModal} onSubmit={handleCheckoutSubmit} setCartItems={setCartItems} />
            <OrdersModal show={showOrdersModal} onClose={closeOrdersModal} />
        </div>
    );
}

export default Layout;
