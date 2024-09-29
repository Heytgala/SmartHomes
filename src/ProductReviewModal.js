import React, { useState, useEffect } from 'react';
import './Productreview.css';
import BASE_URL from './config';

const ProductReviewModal = ({ show, onClose }) => {
    const userName = localStorage.getItem('userName');

    const [categoryName, setCategory] = useState('');
    const [productName, setProductName] = useState('');
    const [storeAddress, setStoreAddress] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [occupation, setOccupation] = useState('');
    const [reviewRating, setReviewRating] = useState('');
    const [reviewComments, setReviewComments] = useState('');

    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const date = new Date();
    const ReviewDate = new Date(date.setDate(date.getDate())).toDateString();

    useEffect(() => {
        if (!show) {
            resetForm();
        } else {
            fetchStores();
            fetchCategories();
            fetchProducts();
        }
    }, [show]);

    const fetchStores = () => {
        fetch(`${BASE_URL}/getStores`)
            .then(response => response.json())
            .then(data => {
                setStores(data);
            })
            .catch(error => {
                console.error('Error fetching stores:', error);
            });
    };

    const fetchProducts = () => {
        fetch(`${BASE_URL}/productlist`) 
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/CategoryServlet`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const resetForm = () => {
        setCategory('');
        setProductName('');
        setStoreAddress('');
        setAge('');
        setGender('');
        setOccupation('');
        setReviewRating('');
        setReviewComments('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const reviewData = {
            categoryName,
            productName,
            storeAddress,
            age,
            gender,
            occupation,
            reviewRating,
            reviewComments,
            userName, 
            ReviewDate
        };

        console.log(reviewData);

        fetch(`${BASE_URL}/submitReview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
            .then(response => {
                if (response.ok) {
                    console.log("Review submitted successfully!");
                    onClose();
                } else {
                    console.error("Failed to submit review");
                }
            })
            .catch(error => {
                console.error("Error during submission:", error);
            });
    };

    const [categoryval, setcategoryval] = useState('');
    
    useEffect(() => {
        if (categoryName === "1") {
            setcategoryval("Smart Speaker");
        } else if (categoryName === "2") {
            setcategoryval("Smart Thermostats");
        }
        else if (categoryName === "3") {
            setcategoryval("Smart Lighting");
        }
        else if(categoryName === "4") {
            setcategoryval("Smart Doorbells");
        }
        else if (categoryName === "5") {
            setcategoryval("Smart Doorlocks");
        }
        else {
            setcategoryval('');
        }
    }, [categoryName]);
        const filteredProducts = products.filter(product => product.categoryName === categoryval);

    return (
        show && (
            <div className="review-modal">
                <div className="review-modal-content">
                    <div>
                        <span className="review-close" onClick={onClose}>&times;</span>
                        <h2 className="titlereview">Product Review Form</h2>
                    </div>

                    <form className="reviewform" onSubmit={handleSubmit}>
                        <div>
                            <label>
                                Category:
                                <select
                                    value={categoryName}
                                    onChange={(e) => { setCategory(e.target.value); setProductName(''); }}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.categoryId}>
                                            {category.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>Product Name:</label>
                            <select
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                            >
                                <option value="">Select a product</option>
                                {filteredProducts.map((product, index) => (
                                    <option key={index} value={product.productId}>
                                        {product.productName}
                                    </option>
                                ))}
                                
                            </select>                           
                        </div>

                        <div>
                            <label>Store Location:</label>
                            <select name="storeAddress" className="Checkoutselect" onChange={(e) => setStoreAddress(e.target.value)} required>
                                <option value="">Select Store</option>
                                {stores.map(store => (
                                    <option key={store.storeID} value={store.storeID}>
                                        {store.street}, {store.city}, {store.state} {store.zipCode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>Age:</label>
                            <input className="number"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Gender:</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label>Occupation:</label>
                            <input className="text"
                                type="text"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Review Rating:</label>
                            <input className="number"
                                type="number"
                                value={reviewRating}
                                onChange={(e) => setReviewRating(e.target.value)}
                                min="1"
                                max="5"
                                required
                            />
                        </div>
                        <div>
                            <label>Review Comments:</label>
                            <textarea className="textarea"
                                value={reviewComments}
                                onChange={(e) => setReviewComments(e.target.value)}
                                required
                            />
                        </div>
                        <div className="buttoncontainer">
                            <button className="reviewbutton" type="submit">Submit Review</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default ProductReviewModal;
