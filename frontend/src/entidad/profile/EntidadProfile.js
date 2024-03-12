import React, { useState, useEffect } from 'react';
import { Card, Col, Row, List, Tag, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import tokenService from "../../services/token.service";
import useFetchState from "../../util/useFetchState";
import notification_icon from '../../static/images/notification_icon.png';
import cesta_icon from '../../static/images/cesta_icon.png';
import description_icon from '../../static/images/description_icon.png';
import "../../static/css/entidad/entidadPage.css";
import jwt_decode from 'jwt-decode';

const user = tokenService.getUser();
const jwt = tokenService.getLocalAccessToken();

export default function EntidadProfile() {

  const { id } = useParams();
  const navigate = useNavigate();  
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const entidadId = jwt_decode(jwt).entidadId;

  useEffect(() => {
    // Verificar si el ID de la URL coincide con el ID de la entidad logueada
    if (id !== entidadId) {
      navigate(`/error/profile`);
    }
  }, [id, entidadId]);



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

  const [citas, setCitas] = useFetchState(
    [], 
    `/api/v1/citas/entidad/${id}`, 
    jwt, 
    setMessage, 
    setVisible
  );

  const today = new Date();

  const nearestCitaAfter = citas.length > 0
    ? citas
        .filter(cita => cita.estado !== "CANCELADA")
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .find(cita => new Date(cita.fecha) >= today)
    : today;

  const nearestCitaBefore = citas.length > 0
    ? citas
        .filter(cita => cita.estado !== "CANCELADA")
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .find(cita => new Date(cita.fecha) <= today)
    : today;

  const nearestCita = nearestCitaAfter || nearestCitaBefore;

  const nearestCitaTime = nearestCita ? new Date(nearestCita.fecha).getTime() : null;
  const currentTime = today.getTime();

  const nextCita = nearestCitaTime > currentTime ? nearestCita : nearestCitaBefore;

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

  function formattedDate2() {
    if (!nextCita.fecha) return "Cargando...";
    const opcionesFecha = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const fecha = new Date(nextCita.fecha);
    return fecha.toLocaleDateString('es-ES', opcionesFecha);
  }

  function formattedTime() {
    if (!nextCita.hora) return "Cargando...";

    const horaFormateada = nextCita.hora.slice(0, -3);
    return horaFormateada;
  }

  const dateCita = formattedDate2() + " " + formattedTime();

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
      title: 'Próxima entrega',
      data: dateCita,
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

  const navigateEditEntidad = () => {
    navigate(`/entidades/${id}/profile/edit`);
  };

  const navigateEditUser = () => {
    navigate(`/users/${entidad.user.id}`);
  };

  const navigateNewComunication = () => {
    navigate(`/comunicaciones/new`);
  };

  const handleComunicacionesClick = () => {
    navigate(`/comunicaciones/${id}`);
  };

  const navigateComunication = (idCommunication) => {
    navigate(`/comunicaciones/${idCommunication}/view`);
  };

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
                <div className='little-card' onClick={handleComunicacionesClick}>
                  <List
                    itemLayout="horizontal"
                    size="large"
                    dataSource={data_notification}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<img src={notification_icon} className="logo-image-entidad"/>}
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
                          description={item.data ? item.data : "Sin cita"}
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
                <Card title="Últimas Notificaciones Enviadas">
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
                            <div className='title' onClick={() => navigateComunication(item.id)}>
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
                  <Button onClick={navigateEditEntidad}>Editar tus datos</Button>
                  <Button onClick={navigateEditUser}>Editar tu usuario</Button>
                  <Button onClick={navigateNewComunication}>Nueva notificación</Button>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
  );
}
