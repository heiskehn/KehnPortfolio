import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Cursor from './components/ui/Cursor';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ui/ProtectedRoute';

import Home from './pages/Home';
import ProjectDetail from './pages/projects/ProjectDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

const AppShell = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      <Cursor />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={
          <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'120px', fontWeight:800, color:'var(--neon)', opacity:0.3 }}>404</div>
            <p style={{ color:'var(--muted)', fontFamily:'Space Mono,monospace', fontSize:'12px', letterSpacing:'4px' }}>PAGE NOT FOUND</p>
            <a href="/" className="btn-secondary">← Back Home</a>
          </div>
        } />
      </Routes>
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
