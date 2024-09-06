import React, { useState } from 'react';
import './App.css';
import logo from './images/logo.png'
import { useNavigate } from 'react-router-dom';


function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[error,setError]=useState('');

    const navigate = useNavigate();

    const handleSubmit = async(event) => {
        event.preventDefault();
        //console.log('Name:', name);
        //console.log('Email:', email);
        //console.log('Password:', password);
        const response = await fetch('http://localhost:8080/SmartHomes/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            name: name,
            email: email,
            password: password
        })
        });

        const data = await response.json();
        if (data.status === 'error' && data.message === 'User already exists') {
                // Trigger a popup or display an error message
                console.error('User already exists. Please try logging in.');
                setError('User already exists. Please try logging in.');
            } else {
                // Navigate to main page if successful
                navigate('/main', { state: { name } });
            }
        
    };
    return (
        <div>
            <div className="loginheader">
                <p>Smart Homes</p>
                <img src={logo} className="logo"></img>
            </div>
            <div className="login-container">
            <h1>Sign In</h1>
            {error && <div className="error-popup">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">Register</button>
            </form>
            </div>
        </div>

    );
}

export default App;
