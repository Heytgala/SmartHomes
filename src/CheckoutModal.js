import React, { useState, useEffect } from 'react';
import './cartmodal.css';
import BASE_URL from './config';

function CheckoutModal({ show, onClose, onSubmit, setCartItems, cartItems }) {
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
    const [stores, setStores] = useState([]); 

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
            fetchStores();
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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const confirmationNum = 'CN' + Math.floor(100000 + Math.random() * 900000);
        setConfirmationNumber(confirmationNum);

        const orderStatus = 'Order Placed';
        setOrderStatus(orderStatus);

        const date = new Date();
        const OrderDate = new Date(date.setDate(date.getDate()));
        const today = new Date();
        const deliveryOrPickupDate = new Date(today.setDate(today.getDate() + 14));
        setDeliveryDate(deliveryOrPickupDate.toDateString());

        const orderData = {
            ...formData,
            confirmationNumber: confirmationNum,
            deliveryDate: deliveryOrPickupDate.toDateString(),
            OrderDate: OrderDate.toDateString(),
            userName: userName,
            orderstatus: orderStatus,
            cartItems: cartItems
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
                            <option value="Home">Home Delivery (Shipping Cost - $50)</option>
                            <option value="Store">In-Store Pickup</option>
                        </select>

                        {formData.deliveryMethod === 'Store' && (
                            <div>
                                <label>Store Location:</label>
                                <select name="storeLocation" className="Checkoutselect" onChange={handleInputChange} required>
                                    <option value="">Select Store</option>
                                    {stores.map(store => (
                                        <option key={store.storeID} value={store.storeID}>
                                            {store.street}, {store.city}, {store.state} {store.zipCode} 
                                        </option>
                                    ))}
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
