import React, { useState } from 'react';
import './App.css';
import logo from './images/logo.png';
import { useNavigate } from 'react-router-dom';
import BASE_URL from './config';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Customer'); 

    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/Register', { state: { role } });
    }

    const showError = (message) => {
        alert(message);
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (event) => {
        localStorage.removeItem('userName');
        event.preventDefault();
        const response = await fetch(`${ BASE_URL }/login?email=${email}&password=${password}&role=${role}`, {
            method: 'GET',
        });

        const data = await response.json();
        if (data.status === 'success') {
            localStorage.setItem('userName', data.userName);
            if (data.role === 'Customer') {
                navigate('/main');
            } else if (data.role === 'Salesman') {
                navigate('/SalesmanDashboard');
            } else if (data.role === 'StoreManager') {
                navigate('/Dashboard');
            }
        } else {
            showError(data.message);
        }

    };

    return (
        <div>
            <div className="loginheader">
                <p>Smart Homes</p>
                <img src={logo} className="logo" alt="Smart Homes Logo" />
            </div>
            <div className="login-container">
                <h1>Log In</h1>
                
                <div className="role-selection">
                    <button onClick={() => setRole('Customer')} className={role === 'Customer' ? 'active' : ''}>
                        Customer
                    </button>
                    <button onClick={() => setRole('Salesman')} className={role === 'Salesman' ? 'active' : ''}>
                        Salesman
                    </button>
                    <button onClick={() => setRole('StoreManager')} className={role === 'StoreManager' ? 'active' : ''}>
                        Store Manager
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Login</button>
                    {role==='Customer'  &&
                    <div>
                        <h2>Don't have an Account?</h2>
                        <button type="button" onClick={handleRegister}>Register</button>
                    </div>
                    }
                </form>
            </div>
        </div>
    );
}

export default App;
