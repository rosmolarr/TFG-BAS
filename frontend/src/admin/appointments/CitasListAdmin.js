import React, { useRef, useState } from 'react';
import tokenService from "../../services/token.service";
import "../../static/css/admin/adminPage.css";
import useFetchState from "../../util/useFetchState";
import { Space, Tag, Button, Input, Modal, Divider, Checkbox, Tooltip } from 'antd';
import { Table } from "ant-table-extensions";
import { SearchOutlined } from '@ant-design/icons';
import ExclamationCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import MediaQuery from 'react-responsive';

const jwt = tokenService.getLocalAccessToken();

export default function CitasListAdmin() {

  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [citas, setCitas] = useFetchState(
    [], 
    `/api/v1/citas`, 
    jwt, 
    setMessage, 
    setVisible
    );

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
      title: 'Entidad',
      dataIndex: 'entidad',
      key: 'entidad',
      render: (entidad) => (entidad.nombre),
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
    {
      title: 'Incidencia',
      dataIndex: 'comentario',
      key: 'comentario',
      render: (comentario) => (
        comentario ? (
          <Tooltip title="Tiene incidencia">
            <ExclamationCircleOutlined style={{ color: 'orange' }} />
          </Tooltip>
        ) : (
          <Tooltip title="Sin incidencia">
          </Tooltip>
        )
      ),
      filters: [
        { text: 'Con incidencia', value: true },
        { text: 'Sin incidencia', value: false },
      ],
      filteredValue: filteredInfo.comentario || null,
      onFilter: (value, record) => {
        const tieneComentario = record.comentario !== null && record.comentario !== undefined && record.comentario !== '';
        return value ? tieneComentario : !tieneComentario;
      },
    },
  ]

  const filteredData = citas.filter((record) => {
    const valuesToSearch = Object.values(record).join(' ').toLowerCase();
    return valuesToSearch.includes(searchText.toLowerCase());
  });

  /** Columnas mostradas */

  const defaultCheckedList = columns.map((item) => item.key);

  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const options = columns.map(({ key, title }) => ({
    label: title,
    value: key,
  }));

  const newColumns = columns.filter((item) => checkedList.includes(item.key));

  const navigate = useNavigate();

  const handleRowClick = (record) => {
    const id = record.id; 
    navigate(`/citas/${id}`);
  };

  const [selectedDate, setSelectedDate] = useState(formatToday());

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

  const [entidades, setEntidades] = useFetchState(
    [],
    `/api/v1/entidades/all`,
    jwt,
    setMessage,
    setVisible
  );

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

  return (
      <div className="admin-page-container">
        <h1>Citas</h1> 
        <MediaQuery minWidth={1225}>
          <Space
            style={{
              marginTop: 8,
            }}
          >
            <Button onClick={navigateNuevaCita}>Nueva cita</Button>
            <Button onClick={clearFilters}>Limpiar filtros</Button>
            <Button onClick={clearAll}>Limpiarlo todo</Button>
          </Space>
        </MediaQuery>
        <MediaQuery maxWidth={1224}>
          <Space
            style={{
              marginTop: 8,
            }}
          >
            <Button  onClick={navigateNuevaCita}>Nueva cita</Button>
          </Space>
        </MediaQuery>
        <Divider>Columnas mostradas</Divider>
        <MediaQuery minWidth={1225}>
          <Checkbox.Group
            value={checkedList}
            options={options}
            onChange={(value) => {
              setCheckedList(value);
            }}
          />
        </MediaQuery>
        <MediaQuery maxWidth={1224}>
          <Checkbox.Group
            value={checkedList}
            options={options}
            onChange={(value) => {
              setCheckedList(value);
            }}
            style={{ display: 'flex', justifyContent: 'center' }}
          />
        </MediaQuery>

        <Table 
          columns={newColumns}
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
