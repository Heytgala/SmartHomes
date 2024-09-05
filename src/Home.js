import React from 'react';
import './global.css';
import homeimg from './images/smart_home.jpg';

function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to Smart Homes</h1>
            <img src={homeimg} className="homeimage"></img>
            <p>Here you'll find all our smart home products such as Doorbells, Speakers and more !!</p>
            <p>We sell top quality products across the world !!</p>
        </div>
    );
}

export default Home;