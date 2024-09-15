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
        deliveryMethod: 'Home',
        storeLocation: ''
    });

    const [confirmationNumber, setConfirmationNumber] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [orderstatus, setOrderStatus] = useState('');

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
                deliveryMethod: 'Home',
                storeLocation: ''
            });
        }
    }, [show]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const confirmationNum = 'CN' + Math.floor(100000 + Math.random() * 900000);
        setConfirmationNumber(confirmationNum);

        const orderStatus = 'Completed';
        setOrderStatus(orderStatus);

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

                setCartItems([]);
                onSubmit(orderData);

                setFormData({
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    creditCard: '',
                    deliveryMethod: 'Home',
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
                            <option value="Home">Home Delivery</option>
                            <option value="Store">In-Store Pickup</option>
                        </select>

                        {formData.deliveryMethod === 'Store' && (
                            <div>
                                <label>Select Store Location:</label>
                                <select name="storeLocation" className="Checkoutselect" onChange={handleInputChange} required>
                                    <option value="">Select Store</option>
                                    <option value="60616 - Chicago">60616 - Chicago</option>
                                    <option value="10005 - New York">10005 - New York</option>
                                    <option value="90007 - Los Angeles">90007 - Los Angeles</option>
                                    <option value="22434 - San Diego">22434 - San Diego</option>
                                    <option value="94016 - San Francisco">94016 - San Francisco</option>
                                    <option value="46204 - Indiana">46204 - Indiana</option>
                                    <option value="27213 - North Carolina">27213 - North Carolina</option>
                                    <option value="02018 - Boston">02018 - Boston</option>
                                    <option value="88901 - Las Vegas">88901 - Las Vegas</option>
                                    <option value="33109 - Miami">33109 - Miami</option>
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
