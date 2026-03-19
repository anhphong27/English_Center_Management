// frontend/src/pages/TaskList.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, Button, 
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import taskService from '../services/taskService';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  // Hàm gọi API lấy dữ liệu
  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Nếu filterStatus rỗng thì lấy tất cả, nếu có thì truyền lên API để lọc
      const params = filterStatus ? { status: filterStatus } : {};
      const data = await taskService.getTasks(params);
      
      // DRF trả về data.results nếu có phân trang, hoặc mảng data trực tiếp
      setTasks(data.results || data); 
    } catch (error) {
      console.error("Lỗi khi tải danh sách Task:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động gọi API khi component vừa render hoặc khi filter thay đổi
  useEffect(() => {
    fetchTasks();
  }, [filterStatus]);

  // Hàm tiện ích để render màu sắc Chip dựa theo trạng thái
  const getStatusChip = (status) => {
    switch (status) {
      case 'PENDING':
      case 'PENDING_TEACHER':
      case 'PENDING_MANAGER':
      case 'PENDING_STAFF':
        return <Chip label="Đang chờ xử lý" color="warning" size="small" />;
      case 'NEEDS_REVISION':
        return <Chip label="Cần chỉnh sửa" color="error" size="small" />;
      case 'DONE':
        return <Chip label="Đã hoàn thành" color="success" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Quản lý Công việc (Workflow Tasks)
      </Typography>

      {/* Thanh công cụ / Bộ lọc */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel>Lọc theo Trạng thái</InputLabel>
          <Select
            value={filterStatus}
            label="Lọc theo Trạng thái"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value=""><em>Tất cả Task</em></MenuItem>
            <MenuItem value="PENDING">Đang chờ xử lý</MenuItem>
            <MenuItem value="NEEDS_REVISION">Cần chỉnh sửa</MenuItem>
            <MenuItem value="DONE">Đã hoàn thành</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary">
          + Tạo Task Mới
        </Button>
      </Paper>

      {/* Bảng Dữ liệu */}
      <TableContainer component={Paper} elevation={2}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><b>Mã Task</b></TableCell>
                <TableCell><b>Loại Công Việc</b></TableCell>
                <TableCell><b>Người Tạo</b></TableCell>
                <TableCell><b>Trạng Thái</b></TableCell>
                <TableCell><b>Ngày Tạo</b></TableCell>
                <TableCell align="center"><b>Hành Động</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Không có công việc nào phù hợp với bộ lọc.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell>#{task.id}</TableCell>
                    <TableCell>{task.task_type}</TableCell>
                    <TableCell>{task.created_by_name || `User ${task.created_by}`}</TableCell>
                    <TableCell>{getStatusChip(task.status)}</TableCell>
                    <TableCell>{new Date(task.created_at).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell align="center">
                      <Button variant="outlined" size="small" startIcon={<VisibilityIcon />}>
                        Xem
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default TaskList;