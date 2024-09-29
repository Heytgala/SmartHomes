import React, { useEffect, useState } from 'react';
import './TrendzModal.css';
import BASE_URL from './config';

const TrendzModal = ({ show, onClose }) => {
    const [likedProducts, setLikedProducts] = useState([]);
    const [zipcodes, setzipcodes] = useState([]);
    const [soldproducts, setsoldproducts] = useState([]);

    useEffect(() => {
        if (show) {
            fetchTopLikedProducts();
            fetchTopZipCodes();
            fetchSoldProducts();
        }
    }, [show]);

    const fetchTopLikedProducts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/TrendingProducts?action=liked`);
            const data = await response.json();
            console.log(data);
            setLikedProducts(data); 
        } catch (error) {
            console.error('Error fetching liked products:', error);
        }
    };

    const fetchTopZipCodes = async () => {
        try {
            const response = await fetch(`${BASE_URL}/TrendingProducts?action=zipcodes`);
            const data = await response.json();
            console.log(data);
            setzipcodes(data);
        } catch (error) {
            console.error('Error fetching liked products:', error);
        }
    };

    const fetchSoldProducts = async () => {
        try {
            const response = await fetch(`${BASE_URL}/TrendingProducts?action=soldproducts`);
            const data = await response.json();
            console.log(data);
            setsoldproducts(data);
        } catch (error) {
            console.error('Error fetching liked products:', error);
        }
    };

    return (
        show && (
            <div className="trend-modal">
                <div className="trend-modal-content">
                    <span className="trend-close" onClick={onClose}>&times;</span>
                    <h2>Trending</h2>

                    <div className="trend-container">
                        <div className="trend-row">
                            <h3 className="trend-row-title">Liked Products</h3>
                            {likedProducts.length > 0 ? (
                                likedProducts.map((item, index) => (
                                    <div key={index} className="trend-subcontainer">
                                        <h4>{item["Product Category Name"]} -  {item["Product Name"]}</h4>
                                        <p>Reviews: {item.reviewComments}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No liked products available.</p>
                            )}
                        </div>

                        <div className="trend-row">
                            <h3 className="trend-row-title">Top Zip Codes</h3>
                            {zipcodes.length > 0 ? (
                                zipcodes.map((item, index) => (
                                    <div key={index} className="trend-subcontainer">
                                        <h4>{item.zipcode}</h4>
                                        <p>Products Sold: {item.productCount}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No zip code data available.</p>
                            )}
                        </div>
                        <div className="trend-row">
                            <h3 className="trend-row-title">Top Sold Products</h3>
                            {soldproducts.length > 0 ? (
                                soldproducts.map((item, index) => (
                                    <div key={index} className="trend-subcontainer">
                                        <h4>Product: {item.productName}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No sold products available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default TrendzModal;
