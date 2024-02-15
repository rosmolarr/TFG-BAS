import React from 'react';
import { FloatButton } from 'antd';
import { BellOutlined } from '@ant-design/icons';

function NotificationAdmin({ notificacionesCount, abrirNotificacion }) {

  return (
    <FloatButton
        badge={{
            count: notificacionesCount,
        }}
        icon={<BellOutlined />}
        onClick={abrirNotificacion}
    />
  );
};

export default NotificationAdmin;
