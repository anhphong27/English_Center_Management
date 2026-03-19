import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, TextField, Button, Card, CardContent, Alert 
} from '@mui/material';
import axios from 'axios'; // Ở đây dùng axios gốc để gọi API login ban đầu

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      // Gọi thẳng vào API backend (không qua axiosClient vì chưa có token)
      const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
        username,
        password
      });

      // Lưu Token vào LocalStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Chuyển hướng người dùng vào Trang chủ (Dashboard)
      navigate('/');
      
    } catch (error) {
      setErrorMsg('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', backgroundColor: '#f4f6f8' 
    }}>
      <Container maxWidth="sm">
        <Card elevation={3} sx={{ padding: 2, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
              ECMS PORTAL
            </Typography>
            <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
              Hệ thống quản lý trung tâm tiếng Anh
            </Typography>

            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                variant="outlined"
                margin="normal"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                variant="outlined"
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Đăng Nhập
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;