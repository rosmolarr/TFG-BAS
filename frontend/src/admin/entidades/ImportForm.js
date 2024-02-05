import React, { useState } from 'react';
import tokenService from "../../services/token.service";

const jwt = tokenService.getLocalAccessToken();

const ImportForm = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [array, setArray] = useState([]);
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const lines = string.split("\n");
    const csvHeader = lines[0].split(";").map(header => header.trim());
    const array = lines.slice(1).map((line, index) => {
      const values = line.split(";");
      const obj = csvHeader.reduce((object, header, columnIndex) => {
        object[header] = values[columnIndex].trim();
        return object;
      }, {}); 
      return obj;
    });
    setArray(array);
  };
  

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);

        // Send the array to the backend
        fetch("/api/v1/entidades/import", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(array),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Response from backend:", data);
          })
          .catch((err) => {
            console.error("Error sending data to backend:", err);
          });
      };

      fileReader.readAsText(file, 'ISO-8859-1');
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button type="submit">Importar</button>
    </form>
  );
};

export default ImportForm;