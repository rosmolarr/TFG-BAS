import React, { useRef, useState } from 'react';
import tokenService from "../../services/token.service";
import "../../static/css/admin/adminPage.css";
import useFetchState from "../../util/useFetchState";
import { Space, Tag, Button, Input, Modal, Divider, Checkbox } from 'antd';
import { Table } from "ant-table-extensions";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useNavigate, useParams, Link } from 'react-router-dom';

const jwt = tokenService.getLocalAccessToken();

export default function CitasListEntidadAdmin() {

  const { id } = useParams();
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [citas, setCitas] = useFetchState(
    [], 
    `/api/v1/citas/entidad/${id}`, 
    jwt, 
    setMessage, 
    setVisible
  );

  const [entidad, setEntidad] = useFetchState(
    [],
    `/api/v1/entidades/${id}`,
    jwt,
    setMessage,
    setVisible
  );

  function entidadName(name) {
    if (name === undefined) {
      return ""; 
    }
    const lowerCaseName = name.toLowerCase();
    const capitalizedFirstLetter = lowerCaseName.charAt(0).toUpperCase();
    const result = capitalizedFirstLetter + lowerCaseName.slice(1);
    return result;
  }

  let nombreEntidad = entidadName(citas[0]?.entidad?.nombre);

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

  const estadoColorMap = {
    ENVIADA: 'gold',
    ACEPTADA: 'purple',
    VALIDADA: 'green',
    CANCELADA: 'red'
  };

  const columns = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      sorter: (a, b) => new Date(a.fecha) - new Date(b.fecha),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Hora',
      dataIndex: 'hora',
      key: 'hora',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      filters: [
        { text: 'ENVIADA', value: 'ENVIADA' },
        { text: 'ACEPTADA', value: 'ACEPTADA' },
        { text: 'VALIDADA', value: 'VALIDADA' },
        { text: 'CANCELADA', value: 'CANCELADA' }
    
      ],
      filteredValue: filteredInfo.estado || null,
      onFilter: (value, record) => record.estado.includes(value),
      render: (estado) => (
        <Tag color={estadoColorMap[estado]} key={estado}>
          {estado}
        </Tag>
      ),
    },
    {
      title: 'Palet',
      dataIndex: 'palet',
      key: 'palet',
    },
  ]

  const filteredData = citas.filter((record) => {
    const valuesToSearch = Object.values(record).join(' ').toLowerCase();
    return valuesToSearch.includes(searchText.toLowerCase());
  });

  const selectedCita = {
    id: "",
    fecha: "",
    hora: "",
    estado: "ENVIADA",
    entidad: entidad
  };

  const navigate = useNavigate();  

  const navigateNuevaCita = () => {
    navigate('/citas/new', { state: { citasBase: selectedCita } });
  };

  
  const handleRowClick = (record) => {
    const id = record.id; 
    navigate(`/citas/${id}`);
  };

  return (
      <div className="admin-page-container">
        <h1>Citas</h1> 
        <Link to={`/entidades/${id}`}>
          <h5 style={{ marginBottom:"5%" }}>{nombreEntidad}</h5>
        </Link> 
        <Space>
          <Button onClick={navigateNuevaCita}>Nueva cita</Button>
          <Button onClick={clearFilters}>Limpiar filtros</Button>
        </Space>

        <Table 
          columns={columns}
          dataSource={filteredData} 
          onChange={handleChange} 
          pagination={{defaultPageSize: 5, pageSizeOptions: [5, 10, 20], showSizeChanger: true, showQuickJumper: true,}}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          />
      </div>
  );
}
