import React, { useState, useEffect } from 'react';
import './OrdersModal.css'; 
import BASE_URL from './config';

const OrdersModal = ({ show, onClose }) => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderDetails, setOrderDetails] = useState(null);
    const itemsPerPage = 5;
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${BASE_URL}/getOrder?userName=${userName}`);
                const data = await response.json();
                setOrders(data);

            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        if (show) {
            fetchOrders();
        }
    }, [show]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(orders.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleCancelOrder = async (orderNumber) => {
        const url = `${BASE_URL}/cancelOrder`;
        console.log('POST URL:', url); 
        console.log('Request Payload:', JSON.stringify({ orderNumber, userName }));

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNumber: orderNumber,
                    userName: userName
                }),
            });

            if (response.ok) {
                setOrders(orders.filter(order => order.confirmationNumber !== orderNumber));
                setOrderDetails(null); 
            } else {
                console.error('Error canceling order:', response.statusText);
            }
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };


    const isCancelButtonEnabled = (deliveryDate) => {
        const today = new Date();
        const deliveryDateObj = new Date(deliveryDate);
        const isBeforeDeliveryDate = today <= deliveryDateObj;
        const isBeforeFiveBusinessDays = today <= new Date(deliveryDateObj.setDate(deliveryDateObj.getDate() - 5));

        return isBeforeDeliveryDate && isBeforeFiveBusinessDays;
    };


    return (
        show && (
            <div className="orders-modal">
                <div className="orders-modal-content">
                    <span className="orders-close" onClick={onClose}>&times;</span>
                    <h2>Orders</h2>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Delivery Method</th>
                                <th>Store Location</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.confirmationNumber}>
                                    <td>{order.confirmationNumber}</td>
                                    <td>{order.deliveryOption}</td>
                                    <td>{order.storeLocation}</td>
                                    <td>{order.orderstatus}</td>
                                    <td>
                                        <button
                                            disabled={!isCancelButtonEnabled(order.estimatedDeliveryDate)}
                                            onClick={() => handleCancelOrder(order.confirmationNumber)}
                                            className="orders-button"
                                        >
                                            Cancel Order
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="orders-pagination-controls">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>Page {currentPage}</span>
                        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(orders.length / itemsPerPage)}>
                            Next
                        </button>
                    </div>  
                </div>
            </div>
        )
    );
};

export default OrdersModal;
