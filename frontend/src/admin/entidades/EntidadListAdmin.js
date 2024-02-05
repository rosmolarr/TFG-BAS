import React, { useRef, useState } from 'react';
import tokenService from "../../services/token.service";
import "../../static/css/admin/adminPage.css";
import useFetchState from "../../util/useFetchState";
import { Space, Table, Tag, Button, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import ImportForm from './ImportForm';
import Layout from '../../Layout.js';

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

  function formatTipoEntidad(enumValue) {
    // Reemplazar "_" con espacio
    return enumValue.replace(/_/g, ' ');
  }

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
      sorter: (a, b) => {
        // Extraer el número de la cadena 'codigo'
        const aNumber = parseInt(a.codigo.slice(1), 10);
        const bNumber = parseInt(b.codigo.slice(1), 10);
  
        // Comparar los números extraídos
        return aNumber - bNumber;
      },
      sortOrder: sortedInfo.columnKey === 'codigo' ? sortedInfo.order : null,
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
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      render: (descripcion) => {
        let color = 'geekblue';
        if (descripcion === 'CONSUMO') {
          color = 'magenta';
        }
        return (
          <Tag color={color} key={descripcion}>
            {descripcion}
          </Tag>
        );
      },
      filters: [
        { text: 'CONSUMO', value: 'CONSUMO' },
        { text: 'REPARTO', value: 'REPARTO' }
    
      ],
      filteredValue: filteredInfo.descripcion || null,
      onFilter: (value, record) => record.descripcion.includes(value),
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

  const filteredData = entidad.filter((record) => {
    const valuesToSearch = Object.values(record).join(' ').toLowerCase();
    return valuesToSearch.includes(searchText.toLowerCase());
  });

  const navigate = useNavigate();  

  const handleRowClick = (record) => {
    const entityId = record.id; 
    navigate(`/entidades/${entityId}`);
  };

  const navidateNewEntidad = () =>{
    navigate(`/entidades/new`);
  };

  const [isImportPopupVisible, setImportPopupVisible] = useState(false);

  const handleImportClick = () => {
    setImportPopupVisible(true);
  };

  const closeImportPopup = () => {
    setImportPopupVisible(false);
  };

  return (
    <Layout>
      <div className="admin-page-container">
        <h1>Entidades</h1>
        <Space
          style={{
            marginBottom: 16,
          }}
        >
          <Button onClick={navidateNewEntidad}>Nueva entidad</Button>
          <Button onClick={handleImportClick}>Importar entidades</Button>
          <Button onClick={clearFilters}>Limpiar filtros</Button>
          <Button onClick={clearAll}>Limpiarlo todo</Button>
        </Space>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          onChange={handleChange} 
          pagination={{defaultPageSize: 7, pageSizeOptions: [7, 10, 20], showSizeChanger: true, showQuickJumper: true,}}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          />

        <Modal
          title="Importar Entidades"
          visible={isImportPopupVisible}
          onCancel={closeImportPopup}
          footer={null}
        >
          <ImportForm onClose={closeImportPopup} />
        </Modal>
      </div>
    </Layout>
  );
}
