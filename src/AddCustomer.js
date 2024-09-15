import React, { useState } from 'react';
import BASE_URL from './config';
import './Addcustomer.css';


function AddCustomerPopup({ onClose }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleAddCustomer = async (event) => {
        event.preventDefault();
        if (!name || !email || !password) {
            alert('Please fill out all fields.');
            return;
        }
        const role = 'Customer';
        const newCustomer = {
            name,
            email,
            password,
            role
        };
        console.log(newCustomer);

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(
                    newCustomer
                ),
            });

            const showError = (message) => {
                alert(message);
                setName('');
                setEmail('');
                setPassword('');
            };

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();
            if (result.status === 'success') {
                alert('Customer Added Successfully !!')
                onClose();
            } else {
                showError(result.message);
            }
        } catch (error) {
            alert('Error Adding Customer');
            console.error(error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>New Customer</h2>
                <form onSubmit={handleAddCustomer}>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="addcustomer-button" onClick={handleAddCustomer}>Add Customer</button>
                    <button className="cancelcustomer-button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default AddCustomerPopup;
