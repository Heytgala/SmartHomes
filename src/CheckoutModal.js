import React, { useState, useEffect } from 'react';
import './cartmodal.css';
import BASE_URL from './config';

function CheckoutModal({ show, onClose, onSubmit, setCartItems }) {
    const userName = localStorage.getItem('userName');
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        creditCard: '',
        deliveryMethod: 'home',
        storeLocation: ''
    });

    const [confirmationNumber, setConfirmationNumber] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [orderstatus, setOrderStatus] = useState('');

    // Reset form and checkout state when modal opens
    useEffect(() => {
        if (show) {
            setConfirmationNumber('');
            setDeliveryDate('');
            setOrderStatus('');
            setFormData({
                name: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                creditCard: '',
                deliveryMethod: 'home',
                storeLocation: ''
            });
        }
    }, [show]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Generate a random confirmation number
        const confirmationNum = 'CN' + Math.floor(100000 + Math.random() * 900000);
        setConfirmationNumber(confirmationNum);

        const orderStatus = 'Completed';
        setOrderStatus(orderStatus);

        // Calculate the delivery/pickup date (2 weeks from today)
        const today = new Date();
        const deliveryOrPickupDate = new Date(today.setDate(today.getDate() + 14));
        setDeliveryDate(deliveryOrPickupDate.toDateString());

        const orderData = {
            ...formData,
            confirmationNumber: confirmationNum,
            deliveryDate: deliveryOrPickupDate.toDateString(),
            userName: userName,
            orderstatus: orderStatus
        };

        console.log("Order Data to be sent:", orderData);

        // POST request to your backend endpoint
        fetch(`${BASE_URL}/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);

                // Clear the cart after successful checkout
                setCartItems([]);
                onSubmit(orderData);

                // Reset form data as well
                setFormData({
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    creditCard: '',
                    deliveryMethod: 'home',
                    storeLocation: ''
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    if (!show) return null;

    return (
        <div className="checkout-modal-overlay">
            <div className="checkout-modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                {!confirmationNumber ? (
                    <form onSubmit={handleSubmit}>
                        <h2>Checkout Form</h2>
                        <label>Name:</label>
                        <input type="text" name="name" className="Checkoutinput" onChange={handleInputChange} required />

                        <label>Address:</label>
                        <input type="text" name="address" className="Checkoutinput" onChange={handleInputChange} required />

                        <label>City:</label>
                        <input type="text" name="city" className="Checkoutinput" onChange={handleInputChange} required />

                        <label>State:</label>
                        <input type="text" name="state" className="Checkoutinput" onChange={handleInputChange} required />

                        <label>Zip Code:</label>
                        <input type="text" name="zip" className="Checkoutinput" onChange={handleInputChange} required />

                        <label>Credit Card Number:</label>
                        <input type="text" name="creditCard" className="Checkoutinput" onChange={handleInputChange} required />

                        <label>Delivery Method:</label>
                        <select name="deliveryMethod" className="Checkoutselect" onChange={handleInputChange}>
                            <option value="home">Home Delivery</option>
                            <option value="store">In-Store Pickup</option>
                        </select>

                        {formData.deliveryMethod === 'store' && (
                            <div>
                                <label>Select Store Location:</label>
                                <select name="storeLocation" className="Checkoutselect" onChange={handleInputChange} required>
                                    <option value="">Select Store</option>
                                    <option value="Store 1 - 12345">Store 1 - 12345</option>
                                    <option value="Store 2 - 54321">Store 2 - 54321</option>
                                    <option value="Store 3 - 11111">Store 3 - 11111</option>
                                    <option value="Store 4 - 22222">Store 4 - 22222</option>
                                    <option value="Store 5 - 33333">Store 5 - 33333</option>
                                </select>
                            </div>
                        )}

                        <button type="submit" className="CheckoutSubmit">Submit</button>
                    </form>
                ) : (
                    <div className="confirmation">
                        <h2>Order Confirmed</h2>
                        <p>Confirmation Number: {confirmationNumber}</p>
                        <p>Delivery/Pickup Date: {deliveryDate}</p>
                        <p>You can cancel your order 5 business days before the delivery date.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CheckoutModal;
