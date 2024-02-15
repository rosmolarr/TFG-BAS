import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProfileError = () => {

  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/dashboard');
  };

  return (
    <Result
      status="403"
      title="Acceso Prohibido"
      subTitle="El acceso a otros perfiles está prohibido. Disculpe las molestias."
      extra={
        <Button type="primary" onClick={handleBackHome}>
          Ir a la página principal
        </Button>
      }
    />
  );
};

export default ProfileError;
