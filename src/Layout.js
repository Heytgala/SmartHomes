import React,{useState} from 'react';
import { useLocation , useNavigate, Outlet} from 'react-router-dom';
import './layout.css';
import './global.css';
import logo from './images/logo.png';
import { FaShoppingCart,FaChevronDown } from 'react-icons/fa';

function Layout() {
    const location = useLocation();
    const name = location.state?.name;
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSection, setExpandedSection] = useState(null);
    const navigate=useNavigate();
    
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        // Add search functionality here
        console.log('Searching for:', event.target.value);
    };

    const handleNavigation = (path) => {
        navigate(path,{state:{name}});
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div>
            <div className="header">
                <div className="header-left">
                    <img src={logo} className="logo" alt="Smart Homes Logo" />
                    <p>Smart Homes</p> 
                    <br/>
                </div>
                <div className="search-container">  
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search Products"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
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
                    <p className="user-name">Welcome, {name}</p>
                    <FaShoppingCart className="cart-icon" />
                </div>
            </div>
            <div className="left-nav-bar">
                <ul className="product-list">
                    <li className="menulist" onClick={() => toggleSection('doorbells')}>Smart Doorbells
                    <FaChevronDown className={`dropdown-icon ${expandedSection === 'doorbells' ? 'rotated' : ''}`} />
                    </li>
                    {expandedSection === 'doorbells' && (
                        <ul className="dropdown-list">
                            <li onClick={() => handleNavigation('/')}>Model A</li>
                            <li onClick={() => handleNavigation('/')}>Model B</li>
                        </ul>
                    )}
                </ul>
                <ul className="product-list">
                    <li className="menulist" onClick={() => toggleSection('doorlocks')}>Smart Doorlocks
                    <FaChevronDown className={`dropdown-icon ${expandedSection === 'doorlocks' ? 'rotated' : ''}`} />
                    </li>
                    {expandedSection === 'doorlocks' && (
                        <ul className="dropdown-list">
                            <li onClick={() => handleNavigation('/')}>Model X</li>
                            <li onClick={() => handleNavigation('/')}>Model Y</li>
                        </ul>
                    )}
                </ul>
                <ul className="product-list">
                    <li className="menulist" onClick={() => toggleSection('speakers')}>Smart Speakers
                    <FaChevronDown className={`dropdown-icon ${expandedSection === 'speakers' ? 'rotated' : ''}`} />
                    </li>
                    {expandedSection === 'speakers' && (
                        <ul className="dropdown-list">
                            <li onClick={() => handleNavigation('/')}>Model 1</li>
                            <li onClick={() => handleNavigation('/')}>Model 2</li>
                        </ul>
                    )}
                </ul>
                <ul className="product-list">
                    <li className="menulist" onClick={() => toggleSection('lightings')}>Smart Lightings
                    <FaChevronDown className={`dropdown-icon ${expandedSection === 'lightings' ? 'rotated' : ''}`} />
                    </li>
                    {expandedSection === 'lightings' && (
                        <ul className="dropdown-list">
                            <li onClick={() => handleNavigation('/')}>Model Alpha</li>
                            <li onClick={() => handleNavigation('/')}>Model Beta</li>
                        </ul>
                    )}
                </ul>
                <ul className="product-list">
                    <li className="menulist" onClick={() => toggleSection('thermostats')}>Smart Thermostats
                    <FaChevronDown className={`dropdown-icon ${expandedSection === 'thermostats' ? 'rotated' : ''}`} />
                    </li>
                    {expandedSection === 'thermostats' && (
                        <ul className="dropdown-list">
                            <li onClick={() => handleNavigation('/')}>Model T1</li>
                            <li onClick={() => handleNavigation('/')}>Model T2</li>
                        </ul>
                    )}
                </ul>                    
            </div>
            <div className="content">
                <Outlet /> {/* Renders child components like Home */}
            </div>
        </div>
    );
}

export default Layout;
