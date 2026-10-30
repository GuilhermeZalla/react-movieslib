import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource-variable/figtree/wght.css';
import './index.css';
import App from './app/App';
const container = document.getElementById('root');
if (!container)
  throw new Error('O elemento raiz da aplicação não foi encontrado.');
ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
