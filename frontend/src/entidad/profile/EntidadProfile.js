import React, { useState, useEffect, useRef } from 'react';
import { Card, Col, Row, List, Tag, Button, Space, Input } from 'antd';
import { Table } from "ant-table-extensions";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useNavigate, useParams } from 'react-router-dom';
import tokenService from "../../services/token.service";
import useFetchState from "../../util/useFetchState";
import notification_icon from '../../static/images/notification_icon.png';
import cesta_icon from '../../static/images/cesta_icon.png';
import description_icon from '../../static/images/description_icon.png';
import "../../static/css/entidad/entidadPage.css";
import jwt_decode from 'jwt-decode';
import MediaQuery from 'react-responsive';

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

  const [personas, setPersonas] = useFetchState(
    [], 
    `/api/v1/personas/entidad/${id}`, 
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

  /** Tabla de personas tuteladas */

  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setSortedInfo(sorter);
  };

  const clearAll = () => {
    setSortedInfo({});
    setSearchText('');
    setSearchedColumn('');
  };

    /** BUSCADOR */

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText('');
    };
    const getColumnSearchProps = (dataIndex, title) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Buscar ${title}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Buscar
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Limpiar
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              Cerrar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#0064c943' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: '#0064c943',
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      ...getColumnSearchProps('nombre','Nombre'),
    },
    {
      title: 'Apellidos',
      dataIndex: 'apellidos',
      key: 'apellidos',
      ...getColumnSearchProps('apellidos','Apellidos'),
    },
    {
      title: 'Edad',
      dataIndex: 'edad',
      key: 'edad',
      sorter: (a, b) => a.edad - b.edad,
      sortOrder: sortedInfo.columnKey === 'edad' && sortedInfo.order,
    },
    {
      title: 'Otros',
      dataIndex: 'otros',
      key: 'otros',
    },
  ];

  const handleNewPersona= () =>{
    navigate(`/personas/entidad/${id}`);
  };

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
        {entidad.descripcion == "REPARTO" && (
          <>
            <MediaQuery minWidth={1225}>
              <Row justify="center" align="top" gutter={[16, 16]}>
                <Col className='admin-column' xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card
                  title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Personas tuteladas</span>
                    <Button onClick={handleNewPersona}>Agregar Personas</Button>
                  </div>
                }>
                    <Table 
                      dataSource={personas} 
                      columns={columns}           
                      onChange={handleChange} 
                      pagination={{defaultPageSize: 5, pageSizeOptions: [5, 10, 20], showSizeChanger: true, showQuickJumper: true,}}
                    />
                  </Card>
                </Col>
              </Row>
            </MediaQuery>
            <MediaQuery maxWidth={1224}>
              <Row justify="center" align="top" gutter={[16, 16]}>
                <Col className='admin-column' xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card
                  title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Personas tuteladas</span>
                    <Button onClick={handleNewPersona}>Agregar</Button>
                  </div>
                }>
                  <List
                    itemLayout="horizontal"
                    size="large"
                    dataSource={personas}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.nombre + " " + item.apellidos}
                          description={item.otros? item.edad + " años"  + " - " + item.otros : item.edad + " años"}
                        />
                      </List.Item>
                    )}
                  />
                  </Card>
                </Col>
              </Row>
            </MediaQuery>
          </>
          )}
      </div>
  );
}
