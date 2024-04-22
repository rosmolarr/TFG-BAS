import React, { useState } from "react";
import { Alert, Button } from "reactstrap";
import FormGenerator from "../../components/formGenerator/formGenerator";
import tokenService from "../../services/token.service";
import "../../static/css/auth/authButton.css";
import { loginFormInputs } from "./form/loginFormInputs";
import { Link } from 'react-router-dom';

export default function Login() {
  const [message, setMessage] = useState(null);
  const loginFormRef = React.createRef();      

  const handleCloseAlert = () => {
    setMessage(null);
  };

  async function handleSubmit({ values }) {
    const reqBody = values;
    setMessage(null);

    await fetch("/api/v1/auth/signin", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(reqBody),
    })
      .then(function (response) {
        if (response.status === 200) return response.json();
        else return Promise.reject("Usuario o contraseña incorrectos");
      })
      .then(function (data) {
        tokenService.setUser(data);
        tokenService.updateLocalAccessToken(data.token);
        window.location.href = "/dashboard";
      })
      .catch((error) => {         
        setMessage(error);
      });            
  }

  return (
    <div className="all-page-container">
      <div className="auth-page-container">
        
        {message && (
          <Alert color="primary">
            {message}
            <Button id="close-button" close onClick={handleCloseAlert} />
          </Alert>
        )}

        <h1>Inicio de sesión</h1>

        <div className="auth-form-container">
          <FormGenerator
            ref={loginFormRef}
            inputs={loginFormInputs}
            onSubmit={handleSubmit}
            numberOfColumns={1}
            listenEnterKey
            buttonText="Iniciar sesión"
            buttonClassName="auth-button"
          />
        </div>

        <div className="auth-header">
          <Link className="home-link" to="/">
            Volver al inicio
          </Link>
        </div>   
      </div>
    </div>
  );  
}
