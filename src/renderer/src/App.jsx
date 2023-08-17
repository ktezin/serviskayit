import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom'
import Layout from './pages/Layout'
import Login from './pages/Login'
import Services from './pages/Services'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="/services" element={<Services />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
