import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { Form, Input, Label, InputGroup, InputGroupText } from "reactstrap";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useFetchState from "../../util/useFetchState";
import tokenService from "../../services/token.service";
import getErrorModal from "../../util/getErrorModal";

const jwt = tokenService.getLocalAccessToken();

function CitasNewAdmin() {

  const location = useLocation();

  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [entidades, setEntidades] = useFetchState(
    [],
    `/api/v1/entidades/all`,
    jwt,
    setMessage,
    setVisible
  );

  // Asignación directa en el estado inicial
  const [cita, setCita] = useState ((location && location.state && location.state.citasBase)  || {
    id: "",
    fecha: "",
    hora: "",
    estado: "ENVIADA",
    palet: "",
    entidad: entidades[0]
  });

  const navigate = useNavigate();

  function handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "entidad") {
      const entidad = entidades.find((entidad) => entidad.id == value);
      setCita({ ...cita, [name]: entidad });
      return;
    }
    setCita({ ...cita, [name]: value });
  }

  function openNotificationWithIcon(type) {
    notification[type]({
      message: 'Cita',
      description: 'Su cita ha sido creada con éxito.',
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("/api/v1/citas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenService.getLocalAccessToken()}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cita),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          setMessage(json.message);
          setVisible(true);
        } else {
          navigate(`/citas`);
          openNotificationWithIcon('success');
        }
      })
      .catch((error) => {
        console.error('Error creating cita:', error);
        alert('An error occurred while creating the cita.');
      });
  };

  const modal = getErrorModal(setVisible, visible, message);

  return (
    <div className="auth-page-container">
      <h2>Añadir Cita</h2>
      {modal}
      <div className="auth-form-container">
        <Form onSubmit={handleSubmit}>
          <div className="custom-form-input">
            <Label for="fecha" className="custom-form-input-label">
              Fecha
            </Label>
            <Input
              type="date"
              required
              name="fecha"
              id="fecha"
              value={cita.fecha}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="hora" className="custom-form-input-label">
              Hora
            </Label>
            <Input
              type="time"
              required
              name="hora"
              id="hora"
              value={cita.hora}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="palet" className="custom-form-input-label">
              Palet
            </Label>
            <Input
              type="integer"
              required
              name="palet"
              id="palet"
              value={cita.palet}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="entidad" className="custom-form-input-label">
              Entidad
            </Label>
            <Input
              type="select"
              required
              name="entidad"
              id="entidad"
              value={cita.entidad.id}
              onChange={handleChange}
              className="custom-input"
            >
              <option value="" disabled>
                Selecciona una entidad
              </option>
              {entidades.map((entidad) => (
                <option key={entidad.id} value={entidad.id}>
                  {entidad.nombre}
                </option>
              ))}
            </Input>
          </div>
          <div className="custom-button-row">
            <button className="auth-button">Guardar</button>
            <Link
              to="/citas"
              className="auth-button"
              style={{ textDecoration: "none" }}
            >
              Cancelar
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CitasNewAdmin;
