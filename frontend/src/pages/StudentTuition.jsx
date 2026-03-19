// frontend/src/pages/StudentTuition.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import studentService from '../services/studentService';

const StudentTuition = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    studentService.getStudents().then(setStudents).catch(console.error);
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Học viên & Học phí</Typography>
        <Button variant="contained" color="primary">+ Thêm Học Viên</Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><b>Mã HV (ID)</b></TableCell>
              <TableCell><b>Họ & Tên</b></TableCell>
              <TableCell><b>Số Điện Thoại</b></TableCell>
              <TableCell><b>Trạng Thái</b></TableCell>
              <TableCell align="center"><b>Học Phí</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>Chưa có dữ liệu học viên.</TableCell></TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>HV-{student.id}</TableCell>
                  <TableCell>{student.full_name}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Chip label={student.status} size="small" color={student.status === 'ACTIVE' ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" color="success" size="small" startIcon={<PaymentIcon />}>
                      Thu Tiền / Gói
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentTuition;