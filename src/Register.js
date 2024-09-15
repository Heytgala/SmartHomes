import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './images/logo.png';
import BASE_URL from './config';

function RegisterPage() {
    useEffect(() => {
        localStorage.removeItem('userName'); 
    }, []);
    const location = useLocation();
    const navigate = useNavigate();
    const role = location.state?.role;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        navigate('/');
    }

    const handleRegister = async (event) => {
        event.preventDefault();
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                name: name,
                email: email,
                password: password,
                role: role 
            })
        });

        const showError = (message) => {
            alert(message);
            setName('');
            setEmail('');
            setPassword('');
        };

        const data = await response.json();
        if (data.status === 'success') {
            console.log(data);
            localStorage.setItem('userName', data.userName);
            navigate('/main');
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
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
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
                    <input type="hidden" value={role} name="role" /> 
                    <button type="submit">Register</button>
                    <div>
                        <h2>Already have an Account?</h2>
                        <button type="button" onClick={handleLogin}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;

