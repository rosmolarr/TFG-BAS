import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'antd';

const CsvGenerator = ({ data, headers, filename, buttonText }) => {
  return (
    <CSVLink data={data} headers={headers} filename={filename}>
      <Button>{buttonText}</Button>
    </CSVLink>
  );
};

export default CsvGenerator;
