import React, { useState } from 'react';
import './UpdateOrderPopup.css';

function UpdateOrderPopup({ order, onClose, onUpdate }) {
    const [orderStatus, setOrderStatus] = useState(order.Order_status);

    const handleStatusChange = (event) => {
        setOrderStatus(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onUpdate(order.Confirmation_number, orderStatus);
    };

    return (
        <div className="update-order-popup">
            <div className="update-order-content">
                <h2>Update Order</h2>
                <form onSubmit={handleSubmit}>
                    <div className="update-form-group">
                        <label>Order Number:</label>
                        <input type="text" value={order.Confirmation_number} readOnly disabled />
                    </div>
                    <div className="update-form-group">
                        <label>Order Status:</label>
                        <select value={orderStatus} onChange={handleStatusChange}>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                    <div className="update-form-actions">
                        <button type="submit" className="update-order-button">Update</button>
                        <button type="button" className="update-cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateOrderPopup;
