import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import ClientPortal from './pages/ClientPortal.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClientPortal />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
