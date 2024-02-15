import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Divider, List, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LineChart, BarChart } from 'recharts';
import { Line, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import tokenService from "../../services/token.service";
import useFetchState from "../../util/useFetchState";
import "../../static/css/admin/adminPage.css";

const jwt = tokenService.getLocalAccessToken();

const DashboardAdmin = () => {
    const entityData = [
        { name: 'Entidad 1', value: 100 },
        { name: 'Entidad 2', value: 200 },
        { name: 'Entidad 3', value: 150 },
    ];

    const communicationData = [
        { name: 'ejemplo', value: 50 },
        { name: 'perro', value: 100 },
        { name: 'loco', value: 75 },
    ];

    const notifications = [
        { id: 1, message: 'Notification 1' },
        { id: 2, message: 'Notification 2' },
        { id: 3, message: 'Notification 3' },
    ];

    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [entidades, setEntidades] = useFetchState(
        [],
        `/api/v1/entidades/all`,
        jwt,
        setMessage,
        setVisible
      );
    
    const [comunicacion, setComunicacion] = useFetchState(
    [],
    `/api/v1/comunicaciones/dashboard`,
    jwt,
    setMessage,
    setVisible
    );

    const lastCommunications = comunicacion.slice(0, 2);
    const totalCommunications = comunicacion.length;
    const totalEntities = entidades.length;

    const pendingCcommunications = comunicacion.filter(
        (comunicacion) => comunicacion.estado === 'PENDIENTE'
    ).length;

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

  const handleComunicationClick = (id) => {
    navigate(`/comunicaciones/${id}`);
  };

  const handleEntidadesClick = () => {
    navigate(`/entidades`);
  };

  const handleComunicacionesClick = () => {
    navigate(`/comunicaciones`);
  };

    return (
            <div style={{ margin: '2%' }}>
                <Row gutter={[16, 16]} style={{marginBottom: '1%'}}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Row gutter={[8, 8]} style={{marginBottom: '1%'}}>
                            <Col span={12}>
                                <Card onClick={handleEntidadesClick}>
                                    <Statistic title="Entidades" value={totalEntities} />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card onClick={handleComunicacionesClick}>
                                    <Statistic title="Total Comunicaciones" value={totalCommunications} />
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col span={12}>
                                <Card>
                                    <Statistic title="Entidades" value={totalEntities} />
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Statistic title="Comunicaciones por responder" value={pendingCcommunications} />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Card>
                            <Statistic title="Entidades" value={totalEntities} />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <Card title="Últimas Notificaciones" bodyStyle={{paddingBottom: '0px', paddingTop: '4px'}}>
                            <List
                                itemLayout="horizontal"
                                size="large"
                                dataSource={lastCommunications}
                                renderItem={(item, index) => (
                                    <List.Item className='notification-list-dashboard' onClick={() => handleComunicationClick(item.id)}>
                                        <Row justify="space-evenly" className='notification-row-dashboard' >
                                            <Col className='date-column-dashboard'>
                                                <div className='day-dashboard'>
                                                    <strong>{formattedDate(item.fecha)[0]}</strong>
                                                </div>
                                                <div className='month-dashboard'>
                                                    {formattedDate(item.fecha)[1]}
                                                </div>
                                            </Col>
                                            <Col flex="auto" className='content-column'>
                                                <div className='title-dashboard'>
                                                    <strong>{item.titulo}</strong>
                                                </div>
                                                <div className='estado-dashboard'>
                                                    <Tag color={estadoColorMap[item.estado]}>{estadoName[item.estado]}</Tag>
                                                </div>
                                            </Col>
                                        </Row>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="Entity Data">
                            <LineChart width={400} height={300} data={entityData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                            </LineChart>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="Communication Data">
                            <BarChart width={400} height={300} data={communicationData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" />
                            </BarChart>
                        </Card>
                    </Col>
                </Row>
            </div>
    );
};

export default DashboardAdmin;
