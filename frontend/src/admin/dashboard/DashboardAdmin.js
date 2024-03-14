import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Divider, List, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LineChart, BarChart, PieChart } from 'recharts';
import { Line, XAxis, YAxis, Tooltip, Legend, Bar, Pie, Cell, CartesianGrid } from 'recharts';
import tokenService from "../../services/token.service";
import useFetchState from "../../util/useFetchState";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, addDays  } from 'date-fns';
import { es } from 'date-fns/locale';
import "../../static/css/admin/adminPage.css";
import MediaQuery from 'react-responsive';

const jwt = tokenService.getLocalAccessToken();

const DashboardAdmin = () => {

    const COLORS = ['#2757da', '#00c4adfb'];

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

    const [citas, setCitas] = useFetchState(
        [], 
        `/api/v1/citas`, 
        jwt, 
        setMessage, 
        setVisible
    );
    

    /**
     * PieChart para entidades
     */

    const totalConsumoEntities = entidades.filter(entidad => entidad.descripcion === 'CONSUMO').length;
    const totalRepartoEntities = entidades.filter(entidad => entidad.descripcion === 'REPARTO').length;

    const pieChartData = [
        { name: 'CONSUMO', value: totalConsumoEntities },
        { name: 'REPARTO', value: totalRepartoEntities },
    ];

    /**
     * Gráfica de líneas para citas por día de la semana
     */

    const currentWeek = eachDayOfInterval({
        start: addDays(startOfWeek(new Date()), 1), // Agregar 1 día para que lunes sea el primero
        end: addDays(endOfWeek(new Date()), 1)
    });
    
    const citasPorDia = currentWeek.map((day) => {
        const citasDelDia = citas.filter((cita) => {
            const citaDate = new Date(cita.fecha);
            return citaDate.getDay() === day.getDay();
        });
        return {
            day: format(day, 'iiii', { locale: es }), // Usar el localizador español
            porcentaje: (citasDelDia.length / citas.length) * 100
        };
    });

    /**
    * Comunicaciones pendientes por entidad
    */

    const communicationsByEntity = entidades.map((entidad) => {
        const maxLength = 20; // Máxima longitud permitida para entityName
        const entityName = entidad.nombre.length > maxLength
            ? entidad.nombre.substring(0, maxLength)
            : entidad.nombre;
    
        const comunicacionesPendientes = comunicacion.filter(
            (com) => com.estado === 'PENDIENTE' && com.entidad.id === entidad.id
        ).length;
    
        return {
            entityName,
            comunicacionesPendientes,
        };
    });

    console.log(communicationsByEntity);

    // Ordenar los datos por la cantidad de comunicaciones pendientes de mayor a menor
    const sortedData = communicationsByEntity.sort((a, b) => b.comunicacionesPendientes - a.comunicacionesPendientes);
    // Tomar las primeras 5 entidades
    const topEntities = sortedData.slice(0, 3);
      
    /**
     * Datos para las mini cards
     */

    const lastCommunications = comunicacion.slice(0, 2);
    const totalCommunications = comunicacion.length;
    const totalEntities = entidades.length;

    const comunicacionesPendientes = comunicacion.filter(
        (comunicacion) => comunicacion.estado === 'PENDIENTE'
    ).length;

    const pendingCitas = citas.filter(
        (cita) => cita.estado === 'ACEPTADA'
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
                                <Statistic title="Total Entidades" value={totalEntities} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card onClick={handleComunicacionesClick}>
                                <MediaQuery minWidth={1225}>
                                    <Statistic title="Total Comunicaciones" value={totalCommunications} />
                                </MediaQuery>
                                <MediaQuery maxWidth={1224}>
                                    <Statistic title="Total Comunic." value={totalCommunications} />
                                </MediaQuery>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]}>
                        <Col span={12}>
                            <Card>
                                <Statistic title="Citas pendientes" value={pendingCitas} />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <Statistic title="Comunic. por leer" value={comunicacionesPendientes} />
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Métrica entidades">
                        <MediaQuery minWidth={1225}>
                            <PieChart width={400} height={130}>
                                <Pie
                                    data={pieChartData}
                                    cx={200}
                                    cy={60}
                                    labelLine={false}
                                    label={(entry) => entry.name}
                                    outerRadius={65}
                                    fill="#8884d8"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </MediaQuery>
                        <MediaQuery maxWidth={1224}>
                            <PieChart width={400} height={130}>
                                <Pie
                                    data={pieChartData}
                                    cx={150}
                                    cy={60}
                                    labelLine={false}
                                    label={(entry) => entry.name}
                                    outerRadius={65}
                                    fill="#8884d8"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </MediaQuery>
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
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <MediaQuery minWidth={1225}>
                        <Card title="Citas por día de la semana">
                            <BarChart width={600} height={300} data={citasPorDia}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                                <Bar dataKey="porcentaje" fill={COLORS[0]}>
                                    {citasPorDia.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </Card>
                    </MediaQuery>
                    <MediaQuery maxWidth={1224}>
                        <Card title="Citas por día de la semana">
                            <BarChart width={300} height={250} data={citasPorDia} style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                            <XAxis dataKey="day"  tick={{ fontSize: 10 }}/>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                                <Bar dataKey="porcentaje" fill={COLORS[0]}>
                                    {citasPorDia.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </Card>
                    </MediaQuery>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Card title="Comunicaciones pendientes por entidad">
                        <MediaQuery minWidth={1225}>
                            <BarChart width={600} height={300} data={topEntities}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="entityName" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="comunicacionesPendientes" fill="#2757da" />
                            </BarChart>
                        </MediaQuery>
                        <MediaQuery maxWidth={1224}>
                            <BarChart width={300} height={250} data={topEntities}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="entityName" tick={{ fontSize: 10 }}/>
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="comunicacionesPendientes" fill="#2757da" />
                            </BarChart>
                        </MediaQuery>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardAdmin;
