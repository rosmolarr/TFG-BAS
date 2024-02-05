// Layout.js

import React from 'react';
import { FloatButton } from 'antd';

const Layout = ({ children }) => {
  return (
    <div>
      {children}
      <FloatButton.BackTop />
    </div>
  );
};

export default Layout;
