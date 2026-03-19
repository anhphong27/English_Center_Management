import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Tùy chỉnh màu sắc chủ đạo của dự án
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // Màu xanh Google
    background: { default: '#f4f6f8' }
  },
  typography: { fontFamily: 'Roboto, sans-serif' }
});

// Component bảo vệ vòng ngoài: Nếu chưa có Token thì đá về trang Login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Các route cần đăng nhập mới vào được sẽ bọc trong ProtectedRoute */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Bắt các đường dẫn sai */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;