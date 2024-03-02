import React, { useState } from 'react';
import tokenService from "../../services/token.service";
import "../../static/css/admin/adminPage.css";
import useFetchState from "../../util/useFetchState";
import { Calendar, Card, List, Typography, Col, Row, Tag } from 'antd';
import moment from 'moment';
import 'moment/locale/es';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const { Title, Text } = Typography;
const jwt = tokenService.getLocalAccessToken();
dayjs.locale('es');

export default function CitasListAdmin() {

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
    true: 'green',
    false: 'red'
  };

  return (
    <div className="admin-page-container">
      <h1>Citas para recoger cestas</h1> 
      <Row gutter={[16, 16]} style={{marginTop: '1%'}}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Card style={{marginRight: '1%'}}>
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
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          {selectedDate && (
            <Card>
              <Title level={4}>Citas para el {formattedDate}:</Title>
              <List
                dataSource={filteredAppointments}
                renderItem={(item) => (
                  <List.Item style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    <Row justify="space-evenly" className='notification-row-dashboard' >
                      <Col className='date-column-dashboard'>
                        <strong>{formattedHour(item.hora)}</strong>
                      </Col>
                      <Col flex="auto" className='content-column'>
                        <div className='title-dashboard'>
                            <strong>{truncateString(item.entidad.nombre, 30)}</strong>
                        </div>
                        <div className='estado-dashboard'>
                          <Tag color={estadoColorMap[item.estado]} key={item.estado}>
                            {item.estado.toString() === 'true' ? 'Aceptada' : 'Pendiente'}
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
      </Row>
    </div>
  );
}
