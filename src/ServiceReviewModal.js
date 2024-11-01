import React, { useState, useEffect } from 'react';
import './Servicereview.css';
import BASE_URL from './config';

const ServiceReviewModal = ({ show, onClose }) => {
    const userName = localStorage.getItem('userName');

    const [ticketstatus, setticketstatus] = useState('');
    const [shipmentDescription, setShipmentDescription] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [orderdata, setOrderIDdata] = useState('');

    const [successOpenMessage, setSuccessOpenMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [ticketNumber, setTicketNumber] = useState('');
    const [AIstatus, setAIstatus] = useState('');
    const [orderids, setOrderdata] = useState([]);

    const [TicketNumberStatus, setTicketNumberStatus] = useState('');

    useEffect(() => {
        if (show) {
            resetForm();
            setSuccessOpenMessage('');
            setSuccessMessage('');
            setTicketNumber('');
        } else {
            fetchOrderId();
        }
    }, [show]);

    const fetchOrderId = () => {
        fetch(`${BASE_URL}/ticketservice?userName=${userName}`)
            .then(response => response.json())
            .then(data => {
                // Ensure data is an array before updating orderids
                if (Array.isArray(data)) {
                    setOrderdata(data);
                } else {
                    console.error("Expected data to be an array:", data);
                    setOrderdata([]);
                }
            })
            .catch(error => {
                console.error('Error fetching order IDs:', error);
            });
    };

    const resetForm = () => {
        setticketstatus('');
        setShipmentDescription('');
        setUploadedImage(null);
        setOrderIDdata('');
        setTicketNumberStatus('');
        setAIstatus('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('ticketstatus', ticketstatus);
        formData.append('shipmentDescription', shipmentDescription);
        formData.append('uploadedImage', uploadedImage);
        formData.append('OrderNumber', orderdata);
        formData.append('TicketNumberStatus', TicketNumberStatus);

        try {
            const response = await fetch(`${BASE_URL}/ticketservice`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                // Log detailed error info
                const errorText = await response.text();
                console.error('Network response was not ok:', response.status, errorText);
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 'success') {
                if (result.tickettype === 'OpenTicket') {
                    setSuccessOpenMessage('Ticket Created Successfully');
                    setTicketNumber(result.ticketNumber);
                }
                else if (result.tickettype === 'Tickettracker') {
                    setSuccessMessage('Status of Ticket');
                    setTicketNumber(result.ticketNumber);
                    setAIstatus(result.AIstatus);
                }
                
            } else {
                console.error('Error Raising Ticket:', result.message);
            }
        } catch (error) {
            alert('Error Raising ticket');
            console.error(error);
        }
    };


    const handleImageUpload = (e) => {
        setUploadedImage(e.target.files[0]);
    };

    return (
        show && (
            <div className="service-review-modal">
                <div className="service-review-modal-content">
                    <div>
                        <span className="service-review-close" onClick={onClose}>&times;</span>
                        <h2 className="service-titlereview">Customer Service</h2>
                    </div>

                    {successOpenMessage && (
                        <div className="confirmation">
                            <h2>{successOpenMessage}</h2>
                            <p>Your Ticket Number is: <strong>{ticketNumber}</strong></p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="confirmation">
                            <h2>{successMessage}</h2>
                            <p>Your Ticket Number is: <strong>{ticketNumber}</strong></p>
                            <p>Ticket Status: <strong>{AIstatus}</strong></p>
                        </div>
                    )}


                    {!successMessage && !successOpenMessage && (
                            <form className="servicereviewform" onSubmit={handleSubmit}>
                                <div>
                                    <label>
                                        Service:
                                        <select
                                            value={ticketstatus}
                                            onChange={(e) => setticketstatus(e.target.value)}
                                            required
                                        >
                                            <option value="">Select service</option>
                                            <option value="OpenTicket">Open Ticket</option>
                                            <option value="StatusTicket">Check Ticket Status</option>
                                        </select>
                                    </label>
                                </div>

                                {ticketstatus === "OpenTicket" && (
                                    <div className="service-review-modal-content">
                                        <label>
                                            Order Number:
                                            <select
                                                value={orderdata}
                                                onChange={(e) => { setOrderIDdata(e.target.value); }}
                                                required
                                            >
                                                <option value="">Select order number</option>
                                                {orderids.map((order, index) => (
                                                    <option key={index} value={order}>
                                                        {order}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <label>
                                            Shipment Box Comment:
                                            <textarea className="textarea"
                                                value={shipmentDescription}
                                                onChange={(e) => setShipmentDescription(e.target.value)}
                                                placeholder="Enter details about the received product or box"
                                                required
                                            />
                                        </label>

                                        <label>
                                            Upload Image:
                                            <input className="servicefile"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                required
                                            />
                                        </label>
                                        <div className="buttoncontainer">
                                            <button className="reviewbutton" type="submit">Raise Ticket</button>
                                        </div>
                                    </div>
                                )}

                                {ticketstatus === "StatusTicket" && (
                                    <div className="service-review-modal-content">
                                        <label>
                                            Ticket Number:
                                            <input type="text" name="TicketNumberStatus" className="TicketNumberStatus" onChange={(e) => setTicketNumberStatus(e.target.value)} required />
                                        </label>
                                        <div className="buttoncontainer">
                                            <button className="reviewbutton" type="submit">Get Status</button>
                                        </div>
                                    </div>
                                )
                                }


                            </form>
                    )}
                   
                </div>
            </div>
        )
    );
};

export default ServiceReviewModal;
