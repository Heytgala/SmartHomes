import React,{useState} from 'react';
import { useLocation } from 'react-router-dom';
import './home.css';
import './global.css';
import logo from './images/logo.png';

function Home() {
    const location = useLocation();
    const name = location.state?.name;
    const [searchTerm, setSearchTerm] = useState('');

    
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        // Add search functionality here
        console.log('Searching for:', event.target.value);
    };

    return (
        <div>
            <div className="header">
                <div className="header-left">
                    <img src={logo} className="logo" alt="Smart Homes Logo" />
                    <p>Smart Homes</p>                    
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
            <div>
                <h2>Welcome, {name}</h2>
            </div>
            
        </div>
    );
}

export default Home;
