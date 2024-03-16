import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Space, notification } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useFetchState from "../../util/useFetchState";
import tokenService from "../../services/token.service";
import getErrorModal from "../../util/getErrorModal.js";

const jwt = tokenService.getLocalAccessToken();

const PersonasNewAdmin = () => {

    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [entidad, setEntidad] = useFetchState(
      [],
      `/api/v1/entidades/${id}`,
      jwt,
      setMessage,
      setVisible
    );

    function openNotificationWithIcon(type) {
        notification[type]({
          message: 'Personas tuteladas',
          description: 'Las personas tuteladas han sido añadidas correctamente.',
        });
      }
    
    const navigate = useNavigate(); 

    const onFinish = (values) => {
        const personasData = values.personas.map(persona => {
            return {
                nombre: persona.nombre,
                apellidos: persona.apellidos,
                edad: persona.edad,
                otros: persona.otros,
                entidad: entidad,
            };
        });

        // Enviar cada persona al backend
        personasData.forEach(personaData => {
            console.log(personaData);
            fetch("/api/v1/personas", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(personaData),
            })
            .then((response) => response.json())
            .then((json) => {
                if (json.message) {
                    setMessage(json.message);
                    setVisible(true);
                } else {
                    navigate(`/entidades/${entidad.id}`);
                    openNotificationWithIcon('success');
                };
            })
            .catch((error) => {
                // Maneja los errores como desees
                console.error("Error al enviar los datos:", error);
            });
        });
    };
    
  const modal = getErrorModal(setVisible, visible, message);

  return (

    <div className="auth-page-container">
        {<h2>Añadir Personas tuteladas</h2>}
        {modal}
        <Form name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
        <Form.List name="personas">
            {(fields, { add, remove }) => (
            <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                    {...restField}
                    name={[name, 'nombre']}
                    fieldKey={[fieldKey, 'nombre']}
                    rules={[{ required: true, message: 'Nombre es requerido' }]}
                    >
                    <Input placeholder="Nombre" />
                    </Form.Item>
                    <Form.Item
                    {...restField}
                    name={[name, 'apellidos']}
                    fieldKey={[fieldKey, 'apellidos']}
                    rules={[{ required: true, message: 'Apellidos es requerido' }]}
                    >
                    <Input placeholder="Apellidos" />
                    </Form.Item>
                    <Form.Item
                    {...restField}
                    name={[name, 'edad']}
                    fieldKey={[fieldKey, 'edad']}
                    rules={[{ required: true, message: 'Edad es requerida' }]}
                    >
                    <Input placeholder="Edad" type="number" />
                    </Form.Item>
                    <Form.Item
                    {...restField}
                    name={[name, 'otros']}
                    fieldKey={[fieldKey, 'otros']}
                    rules={[{ required: false, message: 'Otros datos' }]}
                    >
                    <Input placeholder="Otros datos" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
                ))}
                <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Agregar persona
                </Button>
                </Form.Item>
            </>
            )}
        </Form.List>
        <Form.Item>
            <Button type="primary" htmlType="submit">
            Añadir
            </Button>
        </Form.Item>
        </Form>
    </div>
  );
};

export default PersonasNewAdmin;
