import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'
import App from './App';
import { MenuProvider } from './context/carritoContext';

ReactDOM.render(
  <MenuProvider>
    <App />
  </MenuProvider>,
  document.getElementById('root')
);
