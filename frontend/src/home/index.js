import React from 'react';
import { Link } from 'react-router-dom';
import '../static/css/home/home.css'; 
import logo from '../static/images/logo_banco.png';
import MediaQuery from 'react-responsive';

export default function Home() {
    return (
        <div className="home-page-container">
            <div className="hero-div">
                <MediaQuery minWidth={1225}>
                    <img className="logo-image" src={logo} alt="Banco de alimentos logo" />
                </MediaQuery>
                <MediaQuery maxWidth={1224}>
                    <img className="logo-image-phone" src={logo} alt="Banco de alimentos logo" />
                </MediaQuery>
                <Link className="login-button" to="/login">
                    Iniciar sesión
                </Link>
            </div>
        </div>
    );
}

