import React, { useState } from 'react';
import tokenService from "../../services/token.service";
import { Modal, Button, notification } from 'antd';

const jwt = tokenService.getLocalAccessToken();

const ImportForm = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const text = event.target.result;
      csvFileToArray(text);
    };
    fileReader.readAsText(event.target.files[0], 'ISO-8859-1');
  };

  const csvFileToArray = (string) => {
    const lines = string.split("\n");
    const csvHeader = lines[0].split(";").map(header => header.trim());
    const array = lines.slice(1).map((line, index) => {
      const values = line.split(";");
      values[csvHeader.indexOf('tipo')] = values[csvHeader.indexOf('tipo')].replace(/\s/g, "_");
      const obj = csvHeader.reduce((object, header, columnIndex) => {
        object[header] = values[columnIndex].trim();
        return object;
      }, {}); 
      return obj;
    });
    sendData(array);
  };

  
  function openNotificationWithIcon(type, description) {
    notification[type]({
      message: 'Importación exitosa. Recargue la página para ver los cambios.',
      description: description || 'Los datos han sido importados correctamente.',
    });
  }

  const sendData = (data) => {
    fetch("/api/v1/entidades/import", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al importar los datos. Por favor, inténtelo de nuevo.");
      }
      return res.json();
    })
    .then((responseData) => {
      onClose();
      openNotificationWithIcon('success', 'Un total de '+ responseData.length + ' entidades han sido importadas correctamente. Las entidades duplicadas han sido ignoradas.');
      console.log("Response from backend:", responseData);
    })
    .catch((err) => {
      setMessage(err.message);
      setVisible(true);
      console.error("Error sending data to backend:", err);
    });
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <>
      {visible && (
        <Modal
          title="Error"
          visible={visible}
          onCancel={closeModal}
          footer={[
            <Button key="ok" onClick={closeModal}>
              Ok
            </Button>,
          ]}
        >
          <p>{message}</p>
        </Modal>
      )}
      <form>
        <input type="file" accept=".csv" onChange={handleFileChange} />
      </form>
    </>
  );
};

export default ImportForm;

