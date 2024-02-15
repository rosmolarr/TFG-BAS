import { useState } from "react";
import tokenService from "../../services/token.service.js";
import { Card, Col, Row, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import useFetchState from "../../util/useFetchState.js";
import { useParams } from 'react-router-dom';
import "../../static/css/admin/adminPage.css";

const jwt = tokenService.getLocalAccessToken();

export default function CommunicationView() {
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

  return (
      <div style={{ marginLeft: '5%', marginRight: '5%' }}>
        <Row justify="center" align="top" gutter={[16, 16]}>
          <h1>{comunicacion.titulo}</h1>
        </Row>
        <Row justify="center" align="top" gutter={[16, 16]}>
          <h6>{comunicacion.entidad && comunicacion.entidad.nombre}</h6>
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
          <Row justify="center" gutter={[16, 16]} style={{ marginBottom: '2%' }}>
            <Col span={24}>
              <Card title="Respuesta del Banco" >
              <p> <ExclamationCircleOutlined /> Su comunicación todavía no ha sido respondida</p>
              </Card>
            </Col>
          </Row>
        )}
      </div>
  );
}
