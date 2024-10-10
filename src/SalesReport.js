import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './InventoryReport.css';
import BASE_URL from './config';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SalesReport({ onClose }) {
    const [salesData, setSalesData] = useState([]);
    const [dailySalesData, setDailySalesData] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/salesReport`)
            .then(response => response.json())
            .then(data => {
                setSalesData(data);
            })
            .catch(error => console.error('Error fetching sales data:', error));

        fetch(`${BASE_URL}/dailySalesReport`) 
            .then(response => response.json())
            .then(data => {
                setDailySalesData(data);
            })
            .catch(error => console.error('Error fetching daily sales data:', error));
    }, []);

    const chartData = {
        labels: salesData.map(item => item.productname),
        datasets: [
            {
                label: 'Total Sales',
                data: salesData.map(item => item.totalsales),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    return (
        <div className="inventory-popup-overlay">
            <div className="inventory-popup-content">
                <h2>Sales Report</h2>
                <button className="inventory-close-button" onClick={onClose}>&times;</button>

                <h3>Product Sales</h3>
                <table className="Inventory-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Product Price</th>
                            <th>Number of Items Sold</th>
                            <th>Total Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.productname}</td>
                                <td>${item.productprice.toFixed(2)}</td>
                                <td>{item.productssold}</td>
                                <td>${item.totalsales.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Product Sales Report' }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }}
                />
                <h3>Daily Sales Transaction</h3>
                <table className="Inventory-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Total Sales</th>
                            <th>Total Products Count</th>
                            <th>Product Names [Count]</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailySalesData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.date}</td>
                                <td>${item.totalSales.toFixed(2)}</td>
                                <td>{item.totalProductCount}</td>
                                <td>{item.productNames}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SalesReport;
