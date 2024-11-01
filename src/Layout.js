import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import './layout.css';
import './global.css';
import logo from './images/logo.png';
import { FaShoppingCart, FaChevronDown } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';
import BASE_URL from './config';
import CartModal from './CartModal';
import CheckoutModal from './CheckoutModal';
import OrdersModal from './OrderModal';
import ProductReviewModal from './ProductReviewModal';
import ServiceReviewModal from './ServiceReviewModal';
import TrendzModal from './TrendzModal';

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
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showTrendzModal, setshowTrendzModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
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
    
    const categoryPathonID = {
        4 : '/main/smartdoorbells',
        5: '/main/smartdoorlock',
        1 : '/main/smartspeaker',
        3: '/main/smartlighting',
        2: '/main/smartthermostats',
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

                    if (Array.isArray(data) && data.length === 0) {
                        console.log('Cart is empty');
                        setCartItems([]); 
                        setShowCartModal(true);
                    } else if (Array.isArray(data)) {
                        const updatedCartItems = data.map(item => ({
                            ...item,
                            quantity: 1, 
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
                console.log('Cart is empty or response invalid');
                setCartItems([]); 
                setShowCartModal(true); 
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };


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

    const handleTrendz = () => {
        setshowTrendzModal(true);
    }

    const closeTrendzModal = () => {
        setshowTrendzModal(false);
    }

    const handleReviewClick = () => {
        setShowReviewModal(true);
    }

    const closeReviewModal = () => {
        setShowReviewModal(false);
    }

    const handleServiceClick = () => {
        setShowServiceModal(true);
    }

    const closeServiceModal = () => {
        setShowServiceModal(false);
    }

    const closeOrdersModal = () => {
        setShowOrdersModal(false);
    };

    const aggregateCartItems = (items) => {
        console.log(items);
        const aggregated = items.reduce((acc, item) => {
            const existingItem = acc.find(i => i.ProductName === item.ProductName);
            const itemDiscount = parseFloat(item.Discounts) || 0;
            const rebates = parseFloat(item.Rebates) || 0;
            if (existingItem) {
                existingItem.quantity += 1; 
                existingItem.Price = parseFloat(existingItem.Price);
                existingItem.Discounts += itemDiscount;
                existingItem.Rebates += rebates;
                existingItem.total = (
                    (existingItem.Price * existingItem.quantity) - (existingItem.Discounts) - (existingItem.Rebates)
                ).toFixed(2); 
            } else {
                acc.push({
                    ...item,
                    quantity: 1,
                    Price: parseFloat(item.Price),
                    Discounts: itemDiscount,
                    Rebates: rebates,
                    total: (
                        (parseFloat(item.Price) - itemDiscount - rebates) * 1
                    ).toFixed(2)
                });
            }
            return acc;
        }, []);
        return aggregated;
    };

    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        console.log(value);
        if (value) {
            try {
                const response = await fetch(`${BASE_URL}/AjaxUtility?searchTerm=${encodeURIComponent(value)}`); 
                const data = await response.json(); 
                setSuggestions(data); 
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    }

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            console.log(item);
            const discount = parseFloat(item.Discounts) || 0;
            const rebate = parseFloat(item.Rebates) || 0;
            console.log(rebate);
            console.log(discount);
            return total + ((item.Price - discount - rebate) * item.quantity);
        }, 0).toFixed(2);
    };



    const handleRemoveItem = async (item) => {
        try {
            const { ProductName, accessoryname } = item;
            const ProductNameencode = encodeURIComponent(ProductName);
            const accessorynameEncoded = encodeURIComponent(accessoryname);
            const finalAccessoryName = accessorynameEncoded === '' ? null : accessorynameEncoded;
            const response = await fetch(`${BASE_URL}/buyProduct?userName=${userName}&productName=${ProductNameencode}` + (finalAccessoryName ? `&accessoryname=${finalAccessoryName}` : ''), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log(cartItems);
                const updatedCart = cartItems.filter(cartItem =>
                    cartItem.ProductName !== ProductName && cartItem.accessoryname !== finalAccessoryName
                );
                console.log(updatedCart);
                //const updatedCart = cartItems.filter(item => item.ProductName !== productName);
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
                    <button className="service" onClick={ handleServiceClick }>
                        Customer Service
                    </button>
                    <button className="review-orders" onClick={ handleReviewClick }>
                        Product Review
                    </button>
                    <button className="view-order-button" onClick={handleViewOrdersClick}>
                        View Orders
                    </button>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder="Search products..."
                    />
                    
                    {suggestions.length > 0 && (
                        <ul className="search-results-dropdown">
                            {suggestions.map((suggestion, index) => (
                                <li key={suggestion.productName} onClick={() => handleNavigation(categoryPathonID[suggestion.categoryID])}>{suggestion.productName}</li>
                            ))}
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
                    <div className="left-nav-bar-2">
                        <FiTrendingUp size={25} />
                        <button className="trendz" onClick={ handleTrendz }>Trending</button>
                        
                    </div>
                </div>
                
                <div className="content">
                    <Outlet />
                </div>
            </div>
            <CartModal show={showCartModal} onClose={closeCartModal}>
                <h2>Your Cart</h2>
                {cartItems.length > 0 ? (
                    <>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Rebates</th>
                                    <th>Discount</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aggregateCartItems(cartItems).map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.ProductName === "null" ? item.accessoryname : item.ProductName}</td>
                                        <td>${item.Price.toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.Rebates > 0 ? `$${item.Rebates.toFixed(2)}` : ''}</td>
                                        <td>{item.Discounts > 0 ? `$${item.Discounts.toFixed(2)}` : ''}</td>
                                        <td>${item.total}</td>
                                        <td>
                                            <button className="RemoveButton" onClick={() => handleRemoveItem(item)}>
                                                Remove
                                            </button>
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
            

            <CheckoutModal show={showCheckoutModal} onClose={closeCheckoutModal} onSubmit={handleCheckoutSubmit} setCartItems={setCartItems} cartItems={cartItems} />
            <OrdersModal show={showOrdersModal} onClose={closeOrdersModal} />
            <ProductReviewModal show={showReviewModal} onClose={closeReviewModal} />
            <ServiceReviewModal show={showServiceModal} onClose={closeServiceModal} />
            <TrendzModal show={showTrendzModal} onClose={closeTrendzModal }/>
        </div>
    );
}

export default Layout;
