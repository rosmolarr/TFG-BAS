import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Label } from "reactstrap";
import tokenService from "../../services/token.service.js";
import getErrorModal from "../../util/getErrorModal.js";
import getIdFromUrl from "../../util/getIdFromUrl.js";
import useFetchState from "../../util/useFetchState.js";
import jwt_decode from 'jwt-decode';
import { notification } from 'antd';

const jwt = tokenService.getLocalAccessToken();

export default function EntidadEdit() {

  const emptyItem = {
    id: "",
    codigo: "",
    nombre: "",
    nif: "",
    tipo: "",
    descripcion: "",
    direccion: "",
    poblacion: "",
    cp: "",
    email: "",
    telefono1: "",
    telefono2: "",
    beneficiarios: "",
    campo1: "",
    campo2: "",
    user: {
      id: "",
      username: "",
      password: "",
    },
  };

  const id = getIdFromUrl(2);

  const entidadId = jwt_decode(jwt).entidadId;
  const navigate = useNavigate();  

  useEffect(() => {
    if (id !== entidadId) {
      navigate(`/error/profile`);
    }
  }, [id, entidadId]);

  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [entidad, setEntidad] = useFetchState(
    emptyItem,
    `/api/v1/entidades/${id}`,
    jwt,
    setMessage,
    setVisible,
    id
  );

  useEffect(() => {
    // Verifica si la entidad está en modo de edición
    if (id !== "new") {
      // Establece el estado de usuario solo si no existe en la entidad
      if (!entidad.user) {
        setEntidad({
          ...entidad,
          user: {
            id: "",
            username: "",
            password: "",
          },
        });
      }
    }
  }, [entidad, id, setEntidad]);

  function handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setEntidad({ ...entidad, [name]: value });
  }

  function openNotificationWithIcon(type) {
    notification[type]({
      message: 'Perfil de Entidad',
      description: 'Sus datos han sido actualizados con éxito.',
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetch("/api/v1/entidades" + (entidad.id ? "/" + entidad.id : ""), {
      method: entidad.id ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entidad),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.message) {
          setMessage(json.message);
          setVisible(true);
        } else {
        navigate(`/entidades/${entidadId}/profile`);
        openNotificationWithIcon('success');
      };
      })
      .catch((message) => alert(message));
  }

  const modal = getErrorModal(setVisible, visible, message);

  return (
      <div className="auth-page-container">
        {<h2>{id !== "new" ? "Editar Entidad" : "Añadir Entidad"}</h2>}
        {modal}
        <div className="auth-form-container">
          <Form onSubmit={handleSubmit}>
            <div className="custom-form-input">
              <Label for="codigo" className="custom-form-input-label">
                Código
              </Label>
              <Input
                type="text"
                required
                name="codigo"
                id="codigo"
                value={entidad.codigo || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="nombre" className="custom-form-input-label">
                Nombre
              </Label>
              <Input
                type="text"
                required
                name="nombre"
                id="nombre"
                value={entidad.nombre || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="nif" className="custom-form-input-label">
                  NIF
              </Label>
              <Input
                type="text"
                required
                name="nif"
                id="nif"
                value={entidad.nif || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="tipo" className="custom-form-input-label">
                Tipo
              </Label>
              <Input
                id="tipo"
                name="tipo"
                required
                type="select"
                value={entidad.tipo || ""}
                onChange={handleChange}
                className="custom-input"
              >
                <option value="COMUNIDAD_RELIGIOSA">Comunidad Religiosa</option>
                <option value="CENTROS_DE_INSERCION">Centros de Insersión</option>
                <option value="CASAS_DE_AGOGIDAS">Casas de Acogida</option>
                <option value="COMEDOR_SOCIAL">Comedor Social</option>
                <option value="PARROQUIA">Parroquia</option>
                <option value="CENTRO_ASISTENCIAL">Centro Asistencial</option>
                <option value="GUARDERIA">Guardería</option>
                <option value="APOYO_ADICCIONES">Apoyo Adicciones</option>
                <option value="APOYO_A_MENORES_Y_ADOLESCENTES">Apoyo a Menores y Adolescentes</option>
              </Input>
            </div>
            <div className="custom-form-input">
              <Label for="descripcion" className="custom-form-input-label">
                Descripción
              </Label>
              <Input
                id="descripcion"
                name="descripcion"
                required
                type="select"
                value={entidad.descripcion || ""}
                onChange={handleChange}
                className="custom-input"
              >
                <option value="CONSUMO">Consumo</option>
                <option value="REPARTO">Reparto</option>
              </Input>
            </div>
            <div className="custom-form-input">
              <Label for="direccion" className="custom-form-input-label">
                Dirección
              </Label>
              <Input
                type="text"
                required
                name="direccion"
                id="direccion"
                value={entidad.direccion || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="poblacion" className="custom-form-input-label">
                Población
              </Label>
              <Input
                type="text"
                required
                name="poblacion"
                id="poblacion"
                value={entidad.poblacion || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="cp" className="custom-form-input-label">
                  Código Postal
              </Label>
              <Input
                type="text"
                required
                name="cp"
                id="cp"
                value={entidad.cp || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="email" className="custom-form-input-label">
                  Email
              </Label>
              <Input
                type="text"
                required
                name="email"
                id="email"
                value={entidad.email || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="telefono1" className="custom-form-input-label">
                  Teléfono
              </Label>
              <Input
                type="text"
                required
                name="telefono1"
                id="telefono1"
                value={entidad.telefono1 || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="telefono2" className="custom-form-input-label">
                Teléfono secundario
              </Label>
              <Input
                type="text"
                name="telefono2"
                id="telefono2"
                value={entidad.telefono2 || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="beneficiarios" className="custom-form-input-label">
                  Beneficiarios
              </Label>
              <Input
                type="int"
                required
                name="beneficiarios"
                id="beneficiarios"
                value={entidad.beneficiarios || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="campo1" className="custom-form-input-label">
                  Campo 1
              </Label>
              <Input
                type="int"
                name="campo1"
                id="campo1"
                value={entidad.campo1 || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-form-input">
              <Label for="campo2" className="custom-form-input-label">
                  Campo 2
              </Label>
              <Input
                type="int"
                name="campo2"
                id="campo2"
                value={entidad.campo2 || ""}
                onChange={handleChange}
                className="custom-input"
              />
            </div>
            <div className="custom-button-row">
              <button className="auth-button">Save</button>
              <Link
                to={`/entidades/${entidadId}/profile`}
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
