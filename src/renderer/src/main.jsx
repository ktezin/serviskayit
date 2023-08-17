import './assets/index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
