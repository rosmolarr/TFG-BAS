import React, { useRef, useState } from 'react';
import { Link } from "react-router-dom";
import tokenService from "../../services/token.service";
import "../../static/css/admin/adminPage.css";
import getErrorModal from "../../util/getErrorModal";
import useFetchState from "../../util/useFetchState";
import useFetchData from "../../util/useFetchData";
import { Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import Highlighter from 'react-highlight-words';


const jwt = tokenService.getLocalAccessToken();

export default function EntidadListAdmin() {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [entidad, setEntidad] = useFetchState(
    [],
    `/api/v1/entidades/all`,
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
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
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
          color: filtered ? '#0066c9' : undefined,
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
            backgroundColor: '#0066c9',
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

  function formatTipoEntidad(enumValue) {
    // Reemplazar "_" con espacio
    return enumValue.replace(/_/g, ' ');
  }

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
      sorter: (a, b) => a.codigo - b.codigo,
      sortOrder: sortedInfo.columnKey === 'codigo' ? sortedInfo.order : null,
      ...getColumnSearchProps('codigo','Código'),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      ...getColumnSearchProps('nombre','Nombre'),
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono1',
      key: 'telefono1',
      ...getColumnSearchProps('telefono1','Teléfono'),
    },
    {
      title: 'Tipo de entidad',
      dataIndex: 'tipo',
      key: 'tipo',
      filters: [
        { text: 'COMUNIDAD RELIGIOSA', value: 'COMUNIDAD_RELIGIOSA' },
        { text: 'CENTROS DE INSERCIÓN', value: 'CENTROS_DE_INSERCION' },
        { text: 'CASAS DE AGOGIDAS', value: 'CASAS_DE_AGOGIDAS' },
        { text: 'COMEDOR SOCIAL', value: 'COMEDOR_SOCIAL' },
        { text: 'PARROQUIA', value: 'PARROQUIA' },
        { text: 'CENTRO ASISTENCIAL', value: 'CENTRO_ASISTENCIAL' },
        { text: 'GUARDERÍA', value: 'GUARDERIA' },
        { text: 'APOYO ADICCIONES', value: 'APOYO_ADICCIONES' },
        { text: 'APOYO A MENORES Y ADOLESCENTES', value: 'APOYO_A_MENORES_Y_ADOLESCENTES' }
    
      ],
      filteredValue: filteredInfo.tipo || null,
      onFilter: (value, record) => record.tipo.includes(value),
      render: (tipo) => formatTipoEntidad(tipo)
    },
  ]

  return (
    <div className="admin-page-container">
      <h1>Entidades</h1>
      <Space
        style={{
          marginBottom: 16,
        }}
      >
        <Button onClick={clearFilters}>Limpiar filtros</Button>
        <Button onClick={clearAll}>Limpiarlo todo</Button>
      </Space>
      <Table columns={columns} dataSource={entidad} onChange={handleChange}/>
    </div>
  );
}
