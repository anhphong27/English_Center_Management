// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tổng quan (Dashboard)
      </Typography>
      <Card elevation={2} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="body1">
            Chào mừng bạn đến với hệ thống ECMS. Chức năng biểu đồ thống kê sẽ được cập nhật tại đây.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;