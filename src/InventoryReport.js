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
import BASE_URL from './config';
import './InventoryReport.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function InventoryReport({ onClose }) {
    const [allProducts, setAllProducts] = useState([]);
    const [productsOnSale, setProductsOnSale] = useState([]);
    const [productsWithRebates, setProductsWithRebates] = useState([]);

    // Fetching data for all products
    useEffect(() => {
        fetch(`${BASE_URL}/InventoryReport`)
            .then((response) => response.json())
            .then((data) => setAllProducts(data))
            .catch((error) => console.error('Error fetching all products:', error));

        // Fetching data for products on sale
        fetch(`${BASE_URL}/InventoryReport?reportType=sale`)
            .then((response) => response.json())
            .then((data) => setProductsOnSale(data))
            .catch((error) => console.error('Error fetching products on sale:', error));

        // Fetching data for products with rebates
        fetch(`${BASE_URL}/InventoryReport?reportType=rebate`)
            .then((response) => response.json())
            .then((data) => setProductsWithRebates(data))
            .catch((error) => console.error('Error fetching products with rebates:', error));
    }, []);

    const chartData = {
        labels: allProducts.map((product) => product.productname),
        datasets: [
            {
                label: 'Available Products',
                data: allProducts.map((product) => product.availableproductcount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    return (
        <div className="inventory-popup-overlay">
            <div className="inventory-popup-content">
                <h2>Inventory Report</h2>
                <button className="inventory-close-button" onClick={onClose}>&times;</button>

                <h3>Available Products</h3>
                <table className="Inventory-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Available Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allProducts.map((product, index) => (
                            <tr key={index}>
                                <td>{product.productname}</td>
                                <td>{product.productprice}</td>
                                <td>{product.availableproductcount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Bar Chart */}
                <div className="chart-container">
                    <Bar data={chartData} />
                </div>

                {/* Table for products on sale */}
                <h3>Products on Sale</h3>
                <table className="Inventory-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Available Count</th>
                            <th>Sale Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsOnSale.map((product, index) => (
                            <tr key={index}>
                                <td>{product.productname}</td>
                                <td>{product.productprice}</td>
                                <td>{product.availableproductcount}</td>
                                <td>{product.productsale}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Table for products with manufacturer rebates */}
                <h3>Products with Manufacturer Rebates</h3>
                <table className="Inventory-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Available Count</th>
                            <th>Rebate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsWithRebates.map((product, index) => (
                            <tr key={index}>
                                <td>{product.productname}</td>
                                <td>{product.productprice}</td>
                                <td>{product.availableproductcount}</td>
                                <td>{product.productrebate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InventoryReport;
