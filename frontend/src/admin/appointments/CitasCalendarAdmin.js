import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tokenService from "../../services/token.service";
import "../../static/css/admin/adminPage.css";
import useFetchState from "../../util/useFetchState";
import { Calendar, Card, List, Typography, Col, Row, Tag, Button } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const { Title, Text } = Typography;
const jwt = tokenService.getLocalAccessToken();
dayjs.locale('es');

export default function CitasCalendarAdmin() {

  function formatToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = padZero(today.getMonth() + 1); // Suma 1 porque los meses van de 0 a 11
    const day = padZero(today.getDate());
    return `${year}-${month}-${day}`;
  }

  function padZero(value) {
    return value < 10 ? `0${value}` : value; // Agrega un cero inicial si el valor es menor que 10
  }

  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatToday());
  const [citas, setCitas] = useFetchState(
    [], 
    `/api/v1/citas`, 
    jwt, 
    setMessage, 
    setVisible
  );

  const [entidades, setEntidades] = useFetchState(
    [],
    `/api/v1/entidades/all`,
    jwt,
    setMessage,
    setVisible
  );

  const handleDateClick = (value) => {
    setSelectedDate(value.format('YYYY-MM-DD'));
  };

  // Filtra las citas según la fecha seleccionada
  const filteredAppointments = citas.filter((appointment) =>
    appointment.fecha === selectedDate
  );

  const formattedDate = moment(selectedDate).locale('es').format('D [de] MMMM [de] YYYY');

  const formattedHour = (hour) => {
    return hour.split(':').slice(0, 2).join(':');
  };

  const truncateString = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  const estadoColorMap = {
    ENVIADA: 'gold',
    ACEPTADA: 'purple',
    VALIDADA: 'green',
    CANCELADA: 'red'
  };
    
  const navigate = useNavigate();  

  const navigateVerLista = () => {
    navigate('/citas/list');
  };

  const selectedCita = {
    id: "",
    fecha: selectedDate,
    hora: "",
    estado: "ENVIADA",
    entidad: entidades[0]
  };

  const navigateNuevaCita = () => {
    navigate('/citas/new', { state: { citasBase: selectedCita } });
  };

  const handleCitaClick = (id) => {
    navigate(`/citas/${id}`);
  };

  return (
    <div className="admin-page-container">
      <h1>Citas para recoger cestas</h1> 
      <Row gutter={[16, 16]} style={{marginTop: '1%'}}>
        <Col className='admin-column' xs={24} sm={24} md={9} lg={9} xl={9}>
          <Calendar
            onSelect={handleDateClick}
            fullscreen={false}
            style={{ width: '300px' }}
            locale={{
              lang: {
                locale: 'es',
                month: moment().locale('es').format('MMMM'),
                year: moment().locale('es').format('YYYY'),
                day: moment().locale('es').format('D'),
                date: moment().locale('es').format('Fecha'),
              },
            }}
          />
        </Col>
        <Col className='admin-column' xs={24} sm={24} md={10} lg={10} xl={10}>
          {selectedDate && (
            <Card>
              <Title level={4}>Citas para el {formattedDate}:</Title>
              <List
                dataSource={filteredAppointments}
                renderItem={(item) => (
                  <List.Item style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} onClick={() => handleCitaClick(item.id)}>
                    <Row justify="space-evenly" className='notification-row-dashboard' >
                      <Col className='date-column-dashboard'>
                        <strong>{formattedHour(item.hora)}</strong>
                      </Col>
                      <Col flex="auto" className='content-column'>
                        <div className='title-dashboard'>
                            <strong>{truncateString(item.entidad.nombre, 25)}</strong>
                        </div>
                        <div className='estado-dashboard'>
                          <Tag color={estadoColorMap[item.estado]} key={item.estado}>
                            {item.estado}
                          </Tag>
                        </div>
                      </Col>
                  </Row>
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Col>
        <Col className='admin-column' xs={24} sm={24} md={5} lg={5} xl={5}>
          <Card className='button-card-admin' bodyStyle={{  display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Button onClick={navigateNuevaCita}>Nueva cita</Button>
            <Button onClick={navigateVerLista}>Ver en lista</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
