import { useState } from "react";
import tokenService from "../../services/token.service.js";
import { Card, Col, Row, List, Tag, Button, Form, Input } from 'antd';
import useFetchState from "../../util/useFetchState.js";
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../../static/css/admin/adminPage.css";

const jwt = tokenService.getLocalAccessToken();

export default function CommunicationViewAdmin() {
  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [comunicacion, setComunicacion] = useFetchState(
    [],
    `/api/v1/comunicaciones/${id}`,
    jwt,
    setMessage,
    setVisible
  );

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    
    const nuevaComunicacion = {
      ...comunicacion, // Copiar todas las propiedades existentes
      respuesta: values.respuesta, // Añadir la nueva propiedad respuesta
      estado: 'RESPONDIDA', // Añadir la nueva propiedad estado
    };
  
    fetch(`/api/v1/comunicaciones/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaComunicacion),
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
      .catch((message) => alert(message));
  };

  const handleActionClick = (action) => {
    console.log('Action Clicked:', action);
    const nuevaComunicacion = {
      ...comunicacion, // Copiar todas las propiedades existentes
      estado: action, // Añadir la nueva propiedad estado
    };

    fetch(`/api/v1/comunicaciones/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaComunicacion),
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
      .catch((message) => alert(message));
  };

  let entidadId = comunicacion.entidad && comunicacion.entidad.id;

  return (
      <div style={{ marginLeft: '5%', marginRight: '5%' }}>
        <Row justify="center" align="top" gutter={[16, 16]}>
          <h1>{comunicacion.titulo}</h1>
        </Row>
        <Row justify="center" align="top" gutter={[16, 16]}>
          <Link to={`/comunicaciones/entidad/${entidadId}`}>
          <h6>{comunicacion.entidad && comunicacion.entidad.nombre}</h6>
          </Link>
        </Row>
        <Row justify="center" align="top" gutter={[16, 16]} style={{ marginBottom: '2%' }}>
          <Tag 
          color={comunicacion.estado === 'PENDIENTE' ? 'orange' : comunicacion.estado === 'RESPONDIDA' ? 'green' : comunicacion.estado === 'LLAMAR' ? 'volcano' : 'blue'}>
            {comunicacion.estado === 'PENDIENTE' ? 'Pendiente' : comunicacion.estado === 'RESPONDIDA' ? 'Respondida' : comunicacion.estado === 'LLAMAR' ? 'Falta llamar' : 'Falta reunión'}
          </Tag>
        </Row>
        <Row justify="center" gutter={[16, 16]} style={{ marginBottom: '2%' }}>
          <Col span={24}>
            <Card title={comunicacion.titulo}>
              <p>{comunicacion.descripcion}</p>
            </Card>
          </Col>
        </Row>
        {comunicacion.respuesta && (
          <Row justify="center" gutter={[16, 16]} style={{ marginBottom: '2%' }}>
            <Col span={24}>
              <Card title="Respuesta del Banco">
                <p>{comunicacion.respuesta}</p>
              </Card>
            </Col>
          </Row>
        )}
        {!comunicacion.respuesta && (
          <Row justify="center" gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Responder">
                <Form form={form} onFinish={handleSubmit}>
                  <Form.Item name="respuesta" rules={[{ required: true, message: 'Por favor, ingrese una respuesta.' }]}>
                    <Input.TextArea placeholder="Escriba su respuesta aquí" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Enviar Respuesta
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        )}
        <Row justify="start" align="top" gutter={[16, 16]}>
          {comunicacion.respuesta && comunicacion.estado !== 'LLAMAR' && (
            <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              <Button onClick={() => handleActionClick('LLAMAR')}>
                Falta Llamar
              </Button>
            </Col>
          )}
          {comunicacion.respuesta && comunicacion.estado !== 'REUNION' && (
            <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              <Button onClick={() => handleActionClick('REUNION')}>
                Falta Reunión
              </Button>
            </Col>
          )}
          {comunicacion.respuesta && comunicacion.estado !== 'RESPONDIDA' && (
            <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              <Button onClick={() => handleActionClick('RESPONDIDA')}>
                Respondida
              </Button>
            </Col>
          )}
        </Row>
      </div>
  );
}
