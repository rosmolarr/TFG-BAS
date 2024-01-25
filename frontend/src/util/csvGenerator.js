import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'antd';

const CsvGenerator = ({ data, headers, filename, buttonText }) => {
  return (
    <Button>
      <CSVLink data={data} headers={headers} filename={filename} style={{ textDecoration: 'none' }}>
        {buttonText}
      </CSVLink>
    </Button>
  );
};

export default CsvGenerator;
