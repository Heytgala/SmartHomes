import React, { useState } from 'react';
import './App.css';
import logo from './images/logo.png'
import { useNavigate } from 'react-router-dom';


function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);
        navigate('/home',{state:{name}});
    };
    return (
        <div>
            <div className="loginheader">
                <p>Smart Homes</p>
                <img src={logo} className="logo"></img>
            </div>
            <div className="login-container">
            <h1>Sign In</h1>
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
                <button type="submit">Login</button>
            </form>
            </div>
        </div>

    );
}

export default App;
