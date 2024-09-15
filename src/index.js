import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Layout from './Layout';
import Register from './Register';
import Home from './Home';
import ManagerDashboard from './managerdashboard';
import SalesmanDashboard from './SalesmanDashboard';
import SmartDoorbells from './SmartDoorbells';
import SmartDoorlock from './SmartDoorlock';
import SmartLighting from './Smartlighting';
import SmartSpeaker from './SmartSpeaker';
import SmartThermostats from './SmartThermostats';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Dashboard" element={<ManagerDashboard />} />
            <Route path="/SalesmanDashboard" element={<SalesmanDashboard />} />
            <Route path="/main" element={<Layout />} >
                <Route index element={<Home />} />                
            </Route>
            <Route path="/main/smartdoorbells" element={<Layout />} >
                <Route index element={<SmartDoorbells />} />                
            </Route>
            <Route path="/main/smartdoorlock" element={<Layout />} >
                <Route index element={<SmartDoorlock />} />                
            </Route>
            <Route path="/main/smartspeaker" element={<Layout />} >
                <Route index element={<SmartSpeaker />} />                
            </Route>
            <Route path="/main/smartlighting" element={<Layout />} >
                <Route index element={<SmartLighting />} />                
            </Route>
            <Route path="/main/smartthermostats" element={<Layout />} >
                <Route index element={<SmartThermostats />} />                
            </Route>
        </Routes>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
