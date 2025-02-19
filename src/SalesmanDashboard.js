import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import logo from './images/logo.png';
import BASE_URL from './config';
import AddCustomerPopup from './AddCustomer';
import UpdateOrderPopup from './UpdateOrderPopup';

function SalesmanDashboard() {
    const [showAddCustomerPopup, setShowAddCustomerPopup] = useState(false);
    const [showUpdateOrderPopup, setShowUpdateOrderPopup] = useState(false); 
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [customers, setCustomers] = useState([]);
    const userName = localStorage.getItem('userName');
    const [orders, setOrders] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const handleAddCustomerClick = () => {
        setShowAddCustomerPopup(true);
    };

    const handleClosePopup = () => {
        setShowUpdateOrderPopup(false);
        setShowAddCustomerPopup(false);
    };

    const handleCustomerChange = async (event) => {
        const customerName = event.target.value;
        setSelectedCustomer(customerName);

        if (customerName) {
            try {
                const response = await fetch(`${BASE_URL}/getOrder?userName=${customerName}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                    setCurrentPage(1);  
                }
                else if (response.status === 404) {
                    setOrders([]);
                }
                else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        } else {
            setOrders([]);
        }
    };

    const handleCancelOrder = async (orderNumber) => {
        console.log(orderNumber);
        console.log(selectedCustomer);
        const url = `${BASE_URL}/cancelOrder`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNumber: orderNumber,
                    userName: selectedCustomer
                }),
            });

            if (response.ok) {
                setOrders(orders.filter(order => order.OrderID !== orderNumber));
            } else {
                console.error('Error canceling order:', response.statusText);
            }
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    const handleUpdateOrder = (order) => {
        setSelectedOrder(order);
        setShowUpdateOrderPopup(true); 
    };

    const handleUpdateSubmit = async (orderNumber, newStatus) => {
        const url = `${BASE_URL}/updateOrder`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderNumber: orderNumber,
                    newStatus: newStatus,
                    userName: selectedCustomer
                }),
            });

            if (response.ok) {
                setOrders(orders.map(order =>
                    order.OrderID === orderNumber ? { ...order, Order_status: newStatus } : order
                ));
                setShowUpdateOrderPopup(false); 
            } else {
                console.error('Error updating order:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${BASE_URL}/customers`);
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data);
                    console.log(data);
                } else {
                    console.error('Failed to fetch customers');
                }
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const isCancelButtonEnabled = (Orderstatus) => {
        console.log(Orderstatus);
        const isStatusCancelable = Orderstatus === 'Order Placed';
        return isStatusCancelable;
    };

    const isUpdateCancelButtonEnabled = (Orderstatus) => {
        console.log(Orderstatus);
        const isStatusCancelable = Orderstatus === 'Order Placed' || Orderstatus === 'Pending';
        return isStatusCancelable;
    };

    return (
        <div>
            <div className="header">
                <div className="header-left">
                    <img src={logo} className="logo" alt="Smart Homes Logo" />
                    <p>Smart Homes</p>
                    <br />
                </div>
                <div className="menu-right">
                    <p className="user-name">Welcome, {userName}</p>
                </div>
            </div>

            <div className="product-list">
                <div className="title-container">
                    <h1>Dashboard</h1>
                    <button className="add-product-button" onClick={handleAddCustomerClick}>Add New Customer</button>
                </div>
                <div className="customer-container">
                    <label>Select Customer:</label>
                    <select className="customerselect" onChange={handleCustomerChange} value={selectedCustomer}>
                        <option value="">Select Customer</option>
                        {customers.map((customer, index) => (
                            <option key={index} value={customer.name}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                </div>
                {showAddCustomerPopup && (
                    <AddCustomerPopup onClose={handleClosePopup} />
                )}

                {currentOrders.length > 0 && (
                    <div className="orders-salesman-table">
                        <h2 className="orderlisttitle">Order List</h2>
                        <table>
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
                                {currentOrders.map((order) => (
                                    <tr key={order.Confirmation_number}>
                                        <td>{order.Confirmation_number}</td>
                                        <td>{order.DeliveryMethod}</td>
                                        <td>{order.Store_address}</td>
                                        <td>{order.Order_status}</td>
                                        <td>
                                            <button className="orders-salesman-updatebutton" disabled={!isUpdateCancelButtonEnabled(order.Order_status)} onClick={() => handleUpdateOrder(order)}>Update Order</button>
                                            <button
                                                disabled={!isCancelButtonEnabled(order.Order_status)}
                                                onClick={() => handleCancelOrder(order.OrderID)}
                                            className="orders-salesman-button"
                                        >
                                            Cancel Order
                                        </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="salesmanpagination">
                            {[...Array(totalPages).keys()].map(number => (
                                <button
                                    key={number + 1}
                                    onClick={() => handlePageChange(number + 1)}
                                    className={`salesman-page-button ${currentPage === number + 1 ? 'active' : ''}`}
                                >
                                    {number + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {showUpdateOrderPopup && selectedOrder && (
                    <UpdateOrderPopup
                        order={selectedOrder}
                        onClose={handleClosePopup}
                        onUpdate={handleUpdateSubmit}
                    />
                )}
            </div>
        </div>
    );
}

export default SalesmanDashboard;
