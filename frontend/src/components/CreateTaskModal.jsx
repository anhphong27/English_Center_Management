// frontend/src/components/CreateTaskModal.jsx
import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, FormControl, InputLabel, Select, MenuItem, Box 
} from '@mui/material';
import taskService from '../services/taskService';

const CreateTaskModal = ({ open, onClose, onSuccess }) => {
  const [taskType, setTaskType] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Mảng chứa các loại công việc (Hardcode tạm thời)
  const taskTypes = [
    { value: 'CHUYEN_LOP', label: 'Xin chuyển lớp' },
    { value: 'BAO_LUU', label: 'Xin bảo lưu kết quả' },
    { value: 'CHAM_DIEM', label: 'Nhắc nhở chấm điểm' },
    { value: 'KHAC', label: 'Yêu cầu khác' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Dữ liệu gửi xuống Backend
      const newTaskData = {
        task_type: taskType,
        status: 'PENDING',
        rejection_reason: reason // Tạm dùng trường này để lưu lý do/mô tả yêu cầu
        // (Sau này ta sẽ bổ sung assigned_to khi API lấy danh sách User hoàn thiện)
      };

      await taskService.createTask(newTaskData);
      
      // Gọi hàm onSuccess từ component cha (TaskList) để tải lại danh sách
      onSuccess();
      
      // Reset form và đóng modal
      setTaskType('');
      setReason('');
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo task:", error);
      alert("Có lỗi xảy ra khi tạo công việc!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight="bold">Tạo Công Việc Mới (Task)</DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            
            <FormControl fullWidth required>
              <InputLabel>Loại công việc</InputLabel>
              <Select
                value={taskType}
                label="Loại công việc"
                onChange={(e) => setTaskType(e.target.value)}
              >
                {taskTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Mô tả / Lý do yêu cầu"
              multiline
              rows={4}
              fullWidth
              required
              placeholder="Nhập thông tin chi tiết về yêu cầu này (Ví dụ: Học sinh Nguyễn Văn A xin chuyển sang lớp buổi tối...)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Hủy Bỏ
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Tạo Yêu Cầu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTaskModal;