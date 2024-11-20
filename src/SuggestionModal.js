import React, { useState } from 'react';
import './PortalSuggestion.css';
import BASE_URL from './config';

const SuggestionModal = ({ show, onClose }) => {
    const [selectedTab, setSelectedTab] = useState('SearchReviews'); // Default tab state
    const [searchReviewInput, setSearchReviewInput] = useState(''); // Input for Search Reviews
    const [productRecommenderInput, setProductRecommenderInput] = useState(''); // Input for Product Recommendation

    const [searchReviewData, setSearchReviewData] = useState([]);
    const [productRecommendationData, setProductRecommendationData] = useState([]); // To store product recommendation results

    const handleTabClick = (tab) => {
        setSearchReviewInput('');
        setProductRecommenderInput('');
        setSearchReviewData([]);
        setProductRecommendationData([]);
        setSelectedTab(tab);
    };

    const handleClose = () => {
        setSelectedTab('SearchReviews');
        setSearchReviewInput('');
        setProductRecommenderInput('');
        setSearchReviewData([]);
        setProductRecommendationData([]);
        onClose(); 
    };

    const handleSearchReviewSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('reviewsearch', searchReviewInput);
        console.log(formData);
        try {
            const response = await fetch(`${BASE_URL}/portalsuggestions`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Network response was not ok:', response.status, errorText);
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const result = await response.json();
            console.log("JSON RESULT", result);
            if (result.status === 'success') {
                setSearchReviewData(result.finalresult); // Store received data in state
            } else {
                console.error('Error generating search:', result.message);
            }
        } catch (error) {
            alert('Error generating overall search');
            console.error(error);
        }
    };

    const handleProductRecommendationSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('recommendersearch', productRecommenderInput);
        try {
            const response = await fetch(`${BASE_URL}/portalsuggestions`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Network response was not ok:', response.status, errorText);
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 'success') {
                setProductRecommendationData(result.finalresult); // Store product recommendation results
            } else {
                console.error('Error generating search:', result.message);
            }
        } catch (error) {
            alert('Error generating overall search');
            console.error(error);
        }
    };

    return (
        show && (
            <div className="portal-suggestion-modal">
                <div className="portal-suggestion-modal-content">
                    <div>
                        <span className="suggestion-close" onClick={handleClose}>&times;</span>
                        <h2 className="suggestiontitle">Portal Suggestion</h2>
                    </div>
                    <div className="button-group">
                        <button
                            className={`suggestion-button ${selectedTab === 'SearchReviews' ? 'active' : ''}`}
                            onClick={() => handleTabClick('SearchReviews')}
                        >
                            Search Reviews
                        </button>
                        <button
                            className={`suggestion-button ${selectedTab === 'ProductRecommender' ? 'active' : ''}`}
                            onClick={() => handleTabClick('ProductRecommender')}
                        >
                            Product Recommendation
                        </button>
                    </div>
                    <div className="tab-content">
                        {selectedTab === 'SearchReviews' && (
                            <div className="tab-panel">
                                <h3>Search Reviews</h3>
                                <form onSubmit={handleSearchReviewSubmit}>
                                    <input
                                        type="text"
                                        className="searchtext"
                                        placeholder="Enter text"
                                        value={searchReviewInput}
                                        onChange={(e) => setSearchReviewInput(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="searchbutton">
                                        Search
                                    </button>
                                </form>

                                {/* Render Search Reviews Data */}
                                {searchReviewData.length > 0 && (
                                    <div className="search-review-results">
                                        <h4>Semantic Related Reviews</h4>
                                        <ul>
                                            {searchReviewData.map((item, index) => (
                                                <li key={index}>
                                                    <strong>Review Comments:</strong> {item.ReviewComments} <br/>
                                                    <strong>Category:</strong> {item.Category}, &nbsp;
                                                    <strong>Product Name:</strong> {item["Product Name"]}, &nbsp;
                                                    <strong>Store ID:</strong> {item["Store ID"]}, &nbsp;
                                                    <strong>Index: </strong>{item.Index}, &nbsp;
                                                    <strong>Manufacturer Name: </strong>{item["Manufacturer Name"]},&nbsp;
                                                    <strong>City:</strong> {item.City}, &nbsp;
                                                    <strong>Age: </strong> {item.Age}, &nbsp;
                                                    <strong>Gender: </strong>{item.Gender}, &nbsp;                                       
                                                    <strong>Manufacturer Rebate:</strong> {item["Manufacturer Rebate"]}, &nbsp;
                                                    <strong>Occupation:</strong> {item.Occupation}, &nbsp;
                                                    <strong>Review Rating:</strong> {item.ReviewRating}, &nbsp;
                                                    <strong>Zip Code: </strong> {item["Zip Code"]}, &nbsp;
                                                    <strong>State:</strong> {item.State}, &nbsp;
                                                    <strong>Street:</strong> {item.Street}, &nbsp;
                                                    <strong>Product On Sale: </strong>{item["Product On Sale"]} <br/>
                                                    <strong>Similarity Score: {item["similarity score"]}</strong>      
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        {selectedTab === 'ProductRecommender' && (
                            <div className="tab-panel">
                                <h3>Product Recommendation</h3>
                                <form onSubmit={handleProductRecommendationSubmit}>
                                    <input
                                        type="text"
                                        className="searchtext"
                                        placeholder="Enter text"
                                        value={productRecommenderInput}
                                        onChange={(e) => setProductRecommenderInput(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="searchbutton">
                                        Search
                                    </button>
                                </form>

                                {/* Render Product Recommendations Data */}
                                {productRecommendationData.length > 0 && (
                                    <div className="product-recommendation-results">
                                        <h4>Semantic Recommended Products</h4>
                                        <ul>
                                            {productRecommendationData.map((item, index) => (
                                                <li key={index}>
                                                    <strong>Product Name:</strong> {item["Product Name"]},&nbsp;
                                                    <strong>Price:</strong> {item["Product Price"]}, &nbsp;
                                                    <strong>Category:</strong> {item["Category"] }, &nbsp;
                                                    <strong>Description:</strong> {item["Description"]}, &nbsp;
                                                    <strong>Discounts:</strong> {item["Discounts"]}, &nbsp;
                                                    <strong>Rebates:</strong>{item["Rebates"] },&nbsp;
                                                    <strong>Manufacturer Name:</strong> {item["Manufacturer Name"]}<br />
                                                    <strong>Similarity Score:</strong> {item["similarity score"]}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

export default SuggestionModal;
