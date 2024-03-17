import React, { useRef, useState } from 'react';
import tokenService from "../../services/token.service.js";
import "../../static/css/admin/adminPage.css";
import useFetchState from "../../util/useFetchState.js";
import { Space, Table, Tag, Button, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import MediaQuery from 'react-responsive';

const jwt = tokenService.getLocalAccessToken();

export default function CommunicationListAdmin() {

  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [comunicacion, setComunicacion] = useFetchState(
    [],
    `/api/v1/comunicaciones`,
    jwt,
    setMessage,
    setVisible
  );

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

  function entidadName(name) {
    if (name === undefined) {
      return ""; 
    }
    const lowerCaseName = name.toLowerCase();
    const capitalizedFirstLetter = lowerCaseName.charAt(0).toUpperCase();
    const result = capitalizedFirstLetter + lowerCaseName.slice(1);
    return result;
  }


  /** FILTROS */

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
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
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
      ...getColumnSearchProps('titulo','titulo'),
    },
    {
      title: 'Entidad',
      dataIndex: 'entidad',
      key: 'entidad',
      render: (entidad) => (entidadName(entidad.nombre)),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      filters: [
        { text: 'RESPONDIDA', value: 'RESPONDIDA' },
        { text: 'PENDIENTE', value: 'PENDIENTE' },
        { text: 'FALTA LLAMAR', value: 'LLAMAR' },
        { text: 'FALTA REUNIÓN', value: 'REUNION' }
    
      ],
      filteredValue: filteredInfo.estado || null,
      onFilter: (value, record) => record.estado.includes(value),
      render: (estado) => (
        <Tag color={estadoColorMap[estado]} key={estado}>
          {estadoName[estado]}
        </Tag>
      ),
    },
  ]

  const columnsMobile = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Entidad',
      dataIndex: 'entidad',
      key: 'entidad',
      render: (entidad) => (entidadName(entidad.nombre)),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      filters: [
        { text: 'RESPONDIDA', value: 'RESPONDIDA' },
        { text: 'PENDIENTE', value: 'PENDIENTE' },
        { text: 'FALTA LLAMAR', value: 'LLAMAR' },
        { text: 'FALTA REUNIÓN', value: 'REUNION' }
    
      ],
      filteredValue: filteredInfo.estado || null,
      onFilter: (value, record) => record.estado.includes(value),
      render: (estado) => (
        <Tag color={estadoColorMap[estado]} key={estado}>
          {estadoName[estado]}
        </Tag>
      ),
    },
  ]

  const filteredData = comunicacion.filter((record) => {
    const valuesToSearch = Object.values(record).join(' ').toLowerCase();
    return valuesToSearch.includes(searchText.toLowerCase());
  });

  const navigate = useNavigate();  

  const handleRowClick = (record) => {
    const entityId = record.id; 
    navigate(`/comunicaciones/${entityId}`);
  };

  return (
    <div className="admin-page-container">
      <h1>Comunicaciones</h1>
      <Space
        style={{
          marginBottom: 16,
        }}
      >
        <Button onClick={clearFilters}>Limpiar filtros</Button>
        <Button onClick={clearAll}>Limpiarlo todo</Button>
      </Space>
      <MediaQuery minWidth={1225}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          onChange={handleChange} 
          pagination={{defaultPageSize: 7, pageSizeOptions: [7, 10, 20, 30], showSizeChanger: true, showQuickJumper: true,}}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          />
        </MediaQuery>
        <MediaQuery maxWidth={1224}>
          <Table
            columns={columnsMobile}
            rowKey="id"
            expandable={{
              expandedRowRender: (record) => (
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Título: {record.titulo}
                </p>
              ),
            }}
            dataSource={filteredData}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        </MediaQuery>
    </div>
  );
}
