import { useState } from "react";
import tokenService from "../../services/token.service.js";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useFetchState from "../../util/useFetchState.js";
import { useParams, useNavigate, Link } from 'react-router-dom';
import "../../static/css/admin/adminPage.css";
import { Card, Col, Row, Tag, Button } from 'antd';

const jwt = tokenService.getLocalAccessToken();

export default function CommunicationView() {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [cita, setCita] = useFetchState(
    [],
    `/api/v1/citas/${id}`,
    jwt,
    setMessage,
    setVisible
  );

  const navigate = useNavigate();

  const handleActionClick = (action) => {
    const nuevaCita = {
      ...cita, // Copiar todas las propiedades existentes
      estado: action, // Añadir la nueva propiedad estado
    };

    fetch(`/api/v1/citas/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${tokenService.getLocalAccessToken()}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCita),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message) {
            setMessage(json.message);
            setVisible(true);
          } else {
            window.location.reload();
          }
        })
        .catch((error) => {
          console.error('Error creating cita:', error);
          alert('An error occurred while creating the cita.');
        });
  };

  function formattedDate() {
    if (!cita.fecha) return ["Cargando...", "Cargando...", "Cargando..."];

    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date(cita.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
  
    const [dia, mes, año] = fechaFormateada.split(' de ');
  
    return [dia, mes.charAt(0).toUpperCase() + mes.slice(1), año];
  }
  
  function formattedTime() {
    if (!cita.hora) return "Cargando...";

    const horaFormateada = cita.hora.slice(0, -3);
    return horaFormateada;
  }

  return (
      <div style={{ marginLeft: '5%', marginRight: '5%' }}>
        <Row justify="center" align="top" gutter={[16, 16]}>
          <h1>{formattedDate()[0]} de {formattedDate()[1]} del {formattedDate()[2]}</h1>
        </Row>
        <Row justify="center" align="top" gutter={[16, 16]}>
        {cita.entidad && (
          <Link to={`/citas/entidad/${cita.entidad.id}`}>
            <h6>{cita.entidad && cita.entidad.nombre}</h6>
          </Link>
        )}
        </Row>
        <Row justify="center" align="top" gutter={[16, 16]} style={{ marginBottom: '2%' }}>
          <Tag 
          color={cita.estado === 'ENVIADA' ? 'gold' : cita.estado === 'ACEPTADA' ? 'purple' : cita.estado === 'VALIDADA' ? 'green' : 'red'}>
            {cita.estado}
          </Tag>
        </Row>
        <Row justify="center" gutter={[16, 16]} style={{ marginBottom: '2%' }}>
          <Col span={24}>
          <Card title={`Hora: ${formattedTime(cita.hora)}`}>
            <p>Palet: {cita.palet}</p>
          </Card>
          </Col>
        </Row>
        {cita.comentario && (
          <Row justify="center" gutter={[16, 16]} style={{ marginBottom: '2%' }}>
            <Col span={24}>
              <Card title="Incidencia">
                <p>{cita.comentario}</p>
              </Card>
            </Col>
          </Row>
        )}
        {!cita.comentario && (
          <Row justify="center" gutter={[16, 16]} style={{ marginBottom: '2%' }}>
            <Col span={24}>
              <Card title="Incidencia" >
              <p> <ExclamationCircleOutlined /> Actualmente no hay ninguna incidencia</p>
              </Card>
            </Col>
          </Row>
        )}

        <Row justify="start" align="top" gutter={[16, 16]}>
          {cita.estado == 'ACEPTADA' && (
            <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              <Button onClick={() => handleActionClick('VALIDADA')}>
                Validar cita
              </Button>
            </Col>
          )}
          {cita.estado == 'ENVIADA' && (
            <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              <Button onClick={() => handleActionClick('CANCELADA')}>
                Cancelar cita
              </Button>
            </Col>
          )}
          {cita.estado == 'ACEPTADA' && (
            <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              <Button onClick={() => handleActionClick('CANCELADA')}>
                Cancelar cita
              </Button>
            </Col>
          )}
          {cita.estado == 'VALIDADA' && (
            <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              <Button onClick={() => handleActionClick('CANCELADA')}>
                Cancelar cita
              </Button>
            </Col>
          )}
        </Row>

      </div>
  );
}