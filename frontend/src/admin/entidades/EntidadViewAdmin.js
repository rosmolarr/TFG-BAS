import React, { useState } from 'react';
import { Card, Col, Row, List, Tag, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import CsvGenerator from '../../util/csvGenerator';
import tokenService from "../../services/token.service";
import useFetchState from "../../util/useFetchState";
import notification_icon from '../../static/images/notification_icon.png';
import cesta_icon from '../../static/images/cesta_icon.png';
import description_icon from '../../static/images/description_icon.png';
import "../../static/css/admin/adminPage.css";

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

  const [comunicacion, setComunicacion] = useFetchState(
    [],
    `/api/v1/comunicaciones/entidad/${id}`,
    jwt,
    setMessage,
    setVisible
  );

  /**
   * Obtener las dos últimas comunicaciones
   * y el recuento total
   */

  const lastCommunications = comunicacion.slice(0, 2);
  const totalCommunications = comunicacion.length;

  /**
   * Formatear la fecha de la comunicación
   */

  function formattedDate(fechaString) {
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date(fechaString);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
  
    const [dia, mes] = fechaFormateada.split(' de ');
  
    return [dia, mes.charAt(0).toUpperCase() + mes.slice(1)]; 
  }

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
      data: entidad.telefono1,
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

  const data_notification = [
    {
      title: 'Notificaciones',
      data: totalCommunications,
    }
  ];

  const data_entrega = [
    {
      title: 'Entrega',
      data: '10/12/2024',
    }
  ];

  const data_description = [
    {
      title: 'Descripción',
      data: entidad.descripcion,
    }
  ];

  const estadoColorMap = {
    RESPONDIDA: 'green',
    PENDIENTE: 'orange',
    LLAMAR: 'volcano',
    REUNION: 'blue',
  };

  const estadoName = {
    RESPONDIDA: 'Respondida',
    PENDIENTE: 'Pendiente',
    LLAMAR: 'Falta llamar',
    REUNION: 'Falta reunión',
  };
  
  const navigate = useNavigate();  

  const navigateEditEntidad = () => {
    navigate(`/entidades/${id}/edit`);
  }

  const handleComunicationClick = () => {
    navigate(`/comunicaciones/entidad/${id}`);
  }

  /** Exportar a csv */
  const csvHeaders = data.map(item => item.title);
  const csvData = [data.map(item => item.data)];

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
                <div className='little-card' onClick={handleComunicationClick}>
                  <List
                    itemLayout="horizontal"
                    size="large"
                    dataSource={data_notification}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <img src={notification_icon} className="logo-image-entidad"/>
                          }
                          title={item.title}
                          description={item.data}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
              <Col className='admin-column' xs={24} sm={24} md={8} lg={8} xl={8}>
                <div className='little-card'>
                  <List
                    itemLayout="horizontal"
                    size="large"
                    dataSource={data_entrega}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<img src={cesta_icon} className="logo-image-entidad"/>}
                          title={item.title}
                          description={item.data}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
              <Col className='admin-column' xs={24} sm={24} md={8} lg={8} xl={8}>
                <div className='little-card'>
                  <List
                    itemLayout="horizontal"
                    size="large"
                    dataSource={data_description}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<img src={description_icon} className="logo-image-entidad"/>}
                          title={item.title}
                          description={item.data}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Col>
            </Row>      
            <Row gutter={[16, 16]}>
              <Col className='admin-column' xs={24} sm={24} md={16} lg={16} xl={16}>
                <Card title="Últimas Notificaciones">
                <List
                    itemLayout="horizontal"
                    size="large"
                    dataSource={lastCommunications}
                    renderItem={(item, index) => (
                      <List.Item className='notification-list'>
                        <Row justify="space-evenly" className='notification-row'>
                          <Col className='date-column'>
                            <div className='day'>
                              <strong>{formattedDate(item.fecha)[0]}</strong>
                            </div>
                            <div className='month'>
                              {formattedDate(item.fecha)[1]}
                            </div>
                          </Col>
                          <Col flex="auto" className='content-column'>
                            <div className='title'>
                              <strong>{item.titulo}</strong>
                            </div>
                            <div className='estado'>
                              <Tag color={estadoColorMap[item.estado]}>{estadoName[item.estado]}</Tag>
                            </div>
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col className='admin-column' xs={24} sm={24} md={8} lg={8} xl={8}>
                <Card className='button-card-admin' bodyStyle={{  display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <Button onClick={navigateEditEntidad}>Editar</Button>
                  <CsvGenerator
                    data={csvData}
                    headers={csvHeaders}
                    filename="datos.csv"
                    buttonText="Exportar a CSV"
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
  );
}
