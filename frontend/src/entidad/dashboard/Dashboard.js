import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Divider, List, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BarChart } from 'recharts';
import { XAxis, YAxis, Tooltip, Legend, Bar, Pie, Cell } from 'recharts';
import useFetchState from "../../util/useFetchState";
import "../../static/css/admin/adminPage.css";
import jwt_decode from "jwt-decode";
import MediaQuery from 'react-responsive';
import tokenService from '../../services/token.service'; 
import { notification } from 'antd';

const jwt = tokenService.getLocalAccessToken();

const Dashboard = () => {

    const COLORS = ['#2757da', '#00c4adfb', '#fadb14', '#ff4d4f'];

    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [comunicaciones, setComunicacion] = useFetchState(
        [],
        `/api/v1/comunicaciones/dashboard`,
        jwt,
        setMessage,
        setVisible
    );

    const [citas, setCitas] = useFetchState(
        [], 
        `/api/v1/citas/entidad/${jwt_decode(jwt).entidadId}`, 
        jwt, 
        setMessage, 
        setVisible
    );

    const lastCommunications = comunicaciones.filter((com) => com.entidad.id == jwt_decode(jwt).entidadId).slice(0, 2);

    const comunicacionesPorEstado = comunicaciones.filter((com) => com.entidad.id == jwt_decode(jwt).entidadId)
        .reduce((acc, comunicacion) => {
        const { estado } = comunicacion;
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      }, {});

    const dataForChart = Object.keys(comunicacionesPorEstado).map((estado) => ({
    estado,
    cantidad: comunicacionesPorEstado[estado],
    }));

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
    navigate(`/comunicaciones/${id}/view`);
  };

  /**
   * Próxima cita
   */

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

  function formattedDate2() {
    if (!nextCita.fecha) return "Ninguna cita programada";
    const opcionesFecha = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const fecha = new Date(nextCita.fecha);
    return fecha.toLocaleDateString('es-ES', opcionesFecha);
  }

  function formattedTime() {
    if (!nextCita.hora) return "";

    const horaFormateada = nextCita.hora.slice(0, -3);
    return horaFormateada;
  }

  function openNotificationWithIcon(type) {
    notification[type]({
      message: 'Contraseña',
      description: 'Le aconsejamos cambiar su contraseña por seguridad. Recuerde guardarla en un lugar seguro, ya que el equipo del banco no tendrá acceso a ella.',
    });
  }

  useEffect(() => {
    // Verifica si el usuario se ha logueado previamente
    const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore');

    // Si es la primera vez que el usuario inicia sesión, muestra el popup
    if (!hasLoggedInBefore && jwt) {
        openNotificationWithIcon('warning');

      // Actualiza el estado para indicar que el usuario ha iniciado sesión por primera vez
      localStorage.setItem('hasLoggedInBefore', true);
    }
  }, []);

  const dateCita = formattedDate2() + " " + formattedTime();

    return (
        <div style={{ margin: '2%' }}>
            <Row gutter={[16, 16]} style={{marginBottom: '1%'}}>
                <Col xs={24} sm={24} md={8} lg={7} xl={7}>
                    <Card title="Fecha de su próxima recogida de cesta">
                        <Statistic value={dateCita} style={{display: "flex", flexDirection: "row", justifyContent: "center"}}/>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Métrica Comunicaciones">
                    <MediaQuery minWidth={1225}>
                        <BarChart width={400} height={300} data={dataForChart}>
                        <XAxis dataKey="estado" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                            <Bar dataKey="cantidad">
                                {dataForChart.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </MediaQuery>
                    <MediaQuery maxWidth={1224}>
                        <BarChart width={300} height={250} data={dataForChart}>
                        <XAxis dataKey="estado"  tick={{ fontSize: 10 }}/>
                        <YAxis />
                        <Tooltip />
                        <Legend />
                            <Bar dataKey="cantidad">
                                {dataForChart.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </MediaQuery>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={8} lg={9} xl={9}>
                    <Card title="Últimas Comunicaciones Enviadas" styles={{ body: { paddingBottom: '0px', paddingTop: '4px'} }}>
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
        </div>
    );
};

export default Dashboard;
