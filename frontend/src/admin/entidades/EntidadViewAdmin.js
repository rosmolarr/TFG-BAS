import React, { useState } from 'react';
import { Card, Col, Row, List } from 'antd';
import tokenService from "../../services/token.service";
import "../../static/css/admin/adminPage.css";
import getIdFromUrl from "../../util/getIdFromUrl";
import useFetchState from "../../util/useFetchState";
import { useParams } from 'react-router-dom';

const user = tokenService.getUser();
const jwt = tokenService.getLocalAccessToken();

export default function EntidadViewAdmin() {

  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [entidad, setEntidad] = useFetchState(
    [],
    `/api/v1/entidades/${id}`,
    jwt,
    setMessage,
    setVisible
  );

  console.log(entidad);

  const data = [
    {
      title: 'Código',
      data: entidad.codigo,
    },
    {
      title: 'NIF',
      data: entidad.nif,
    },
    {
      title: 'Tipo de entidad',
      data: entidad.tipo,
    },
    {
      title: 'Descripción',
      data: entidad.descripcion,
    },
    {
      title: 'Dirección',
      data: entidad.direccion,
    },
    {
      title: 'Población',
      data: entidad.poblacion,
    },
    {
      title: 'Código postal',
      data: entidad.cp,
    },
    {
      title: 'Email',
      data: entidad.email,
    },
    {
      title: 'Teléfono',
      data: entidad.telefono,
    },
    {
      title: 'Teléfono 2',
      data: entidad.telefono2,
    },
    {
      title: 'Beneficiarios',
      data: entidad.beneficiarios,
    },
  ];

  return (
    <div style={{ margin: '2%' }}>
      <Row justify="center" align="top" gutter={[16, 16]}>
        <Col className='admin-column' xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card title={entidad.nombre}>
            <List
              itemLayout="horizontal"
              size="small"
              dataSource={data}
              renderItem={(item, index) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '10px', fontWeight: 'bold' }}>{item.title}: </div>
                    <div>{item.data}</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col className='admin-column' xs={24} sm={24} md={16} lg={16} xl={16}>
          <Row gutter={[16, 16]}>
            <Col className='admin-column' xs={24} sm={24} md={8} lg={8} xl={8}>
              <Card>
                Datos 1
              </Card>
            </Col>
            <Col className='admin-column' xs={24} sm={24} md={8} lg={8} xl={8}>
              <Card>
                Datos 2
              </Card>
            </Col>
            <Col className='admin-column' xs={24} sm={24} md={8} lg={8} xl={8}>
              <Card>
                Datos 3
              </Card>
            </Col>
          </Row>      
          <Row gutter={[16, 16]}>
            <Col className='admin-column' xs={24} sm={24} md={16} lg={16} xl={16}>
              <Card title="Notificaciones">
                Notificaciones
              </Card>
            </Col>
            <Col className='admin-column' xs={24} sm={24} md={8} lg={8} xl={8}>
              <Card>
                Botones
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
