import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Typography, Box } from '@mui/material';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import TaskList from './pages/TaskList';
import Gradebook from './pages/Gradebook';
import CourseStructure from './pages/CourseStructure';
import StudentTuition from './pages/StudentTuition';

// Giao diện mặc định cho các trang chưa làm kịp
const ComingSoon = ({ title }) => (
  <Box sx={{ textAlign: 'center', mt: 10 }}>
    <Typography variant="h4" color="textSecondary">Màn hình {title}</Typography>
    <Typography variant="body1">Tính năng đang được phát triển...</Typography>
  </Box>
);

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#e3f2fd', dark: '#1565c0' },
    background: { default: '#f4f6f8' }
  },
  typography: { fontFamily: 'Roboto, sans-serif' }
});

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes (Được bọc bên trong AdminLayout) */}
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            {/* Các trang con sẽ được render vào vị trí <Outlet /> của AdminLayout */}
            <Route index element={<Dashboard />} />
            <Route path="courses" element={<CourseStructure />} />
            <Route path="students" element={<StudentTuition />} />
            <Route path="grades" element={<Gradebook />} />
            <Route path="tasks" element={<TaskList />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;