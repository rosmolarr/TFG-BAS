import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Label } from "reactstrap";
import tokenService from "../../services/token.service.js";
import getErrorModal from "../../util/getErrorModal.js";
import getIdFromUrl from "../../util/getIdFromUrl.js";
import useFetchState from "../../util/useFetchState.js";
import jwt_decode from 'jwt-decode';
import { notification } from 'antd';

const jwt = tokenService.getLocalAccessToken();

export default function UserEditAdmin() {

  const navigate = useNavigate();  

  const emptyItem = {
    id: jwt_decode(jwt).userId,
    username: "",
    password: "",
    authority: jwt_decode(jwt).authorities[0],
  };

  const id = getIdFromUrl(2);
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useFetchState(
    emptyItem,
    `/api/v1/users/${id}`,
    jwt,
    setMessage,
    setVisible,
    id
  );

  const entidadId = jwt_decode(jwt).entidadId;

  function handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setUser({ ...user, [name]: value });
  }

  function openNotificationWithIcon(type) {
    notification[type]({
      message: 'Datos de usuario',
      description: 'Sus datos han sido actualizados con éxito. Para ver sus cambios, por favor, vuelva a iniciar sesión.',
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(user);

    fetch("/api/v1/users" + (user.id ? "/" + user.id : ""), {
      method: user.id ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          setMessage(json.message);
          setVisible(true);
        } else {
          navigate(`/logout`);
          openNotificationWithIcon('success');
        };
      })
      .catch((message) => alert(message));
  }

  const modal = getErrorModal(setVisible, visible, message);

  return (
    <div className="auth-page-container">
      <h2>Editar datos de usuario</h2>
      {modal}
      <div className="auth-form-container">
        <Form onSubmit={handleSubmit}>
          <div className="custom-form-input">
            <Label for="username" className="custom-form-input-label">
              Nombre de usuario
            </Label>
            <Input
              type="text"
              required
              name="username"
              id="username"
              value={user.username || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-form-input">
            <Label for="lastName" className="custom-form-input-label">
              Contraseña
            </Label>
            <Input
              type="password"
              required
              name="password"
              id="password"
              value={user.password || ""}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
          <div className="custom-button-row">
            <button className="auth-button">Guardar</button>
            <Link
              to={`/entidades/${entidadId}/profile`}
              className="auth-button"
              style={{ textDecoration: "none" }}
            >
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}