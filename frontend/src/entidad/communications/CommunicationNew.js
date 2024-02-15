import { useState, useEffect, initialState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Label } from "reactstrap";
import tokenService from "../../services/token.service.js";
import getErrorModal from "../../util/getErrorModal.js";
import useFetchState from "../../util/useFetchState.js";
import jwt_decode from 'jwt-decode';
import { notification } from 'antd';

const jwt = tokenService.getLocalAccessToken();

function CommunicationNew({ handleNuevaNotificacion }) {

  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const entidadId = jwt_decode(jwt).entidadId;
  const [entidad, setEntidad] = useFetchState(
    [],
    `/api/v1/entidades/${entidadId}`,
    jwt,
    setMessage,
    setVisible
  );

  function formatToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = padZero(today.getMonth() + 1); // Suma 1 porque los meses van de 0 a 11
    const day = padZero(today.getDate());
    return `${year}-${month}-${day}`;
  }

  function padZero(value) {
    return value < 10 ? `0${value}` : value; // Agrega un cero inicial si el valor es menor que 10
  }

  const emptyItem = {
    id: "",
    fecha: formatToday(),
    titulo: "",
    estado: "PENDIENTE",
    descripcion: "",
    entidad: entidad
  };

  const [comunicacion, setComunicacion] = useState(emptyItem);

  useEffect(() => {
    setComunicacion(emptyItem);
  }, [entidad]);
  
  function handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setComunicacion({ ...comunicacion, [name]: value });
  }

  function openNotificationWithIcon(type) {
    notification[type]({
      message: 'Comunicación',
      description: 'Su comunicación ha sido creada con éxito.',
    });
  }

  const navigate = useNavigate(); 

  function handleSubmit(event) {
    event.preventDefault();

    fetch("/api/v1/comunicaciones", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comunicacion),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          setMessage(json.message);
          setVisible(true);
        } else {
          handleNuevaNotificacion();
          navigate(`/comunicaciones/${entidadId}`);
          openNotificationWithIcon('success');
        };
      })
      .catch((message) => alert(message));
  }

  const modal = getErrorModal(setVisible, visible, message);

  return (
      <div className="auth-page-container">
        {<h2>Añadir Comunicación</h2>}
        {modal}
        <div className="auth-form-container">
          <Form onSubmit={handleSubmit}>
            <div className="custom-form-input">
              <Label for="titulo" className="custom-form-input-label">
                Título
              </Label>
              <Input
                type="text"
                required
                name="titulo"
                id="titulo"
                value={comunicacion.titulo}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="descripcion" className="custom-form-input-label">
                Descripción
              </Label>
              <Input
                type="text"
                required
                name="descripcion"
                id="descripcion"
                value={comunicacion.descripcion}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-button-row">
              <button className="auth-button">Save</button>
              <Link
                to="/comunicaciones"
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

export default CommunicationNew;
