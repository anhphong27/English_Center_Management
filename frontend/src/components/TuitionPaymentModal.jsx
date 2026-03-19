// frontend/src/components/TuitionPaymentModal.jsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, Divider } from '@mui/material';
import studentService from '../services/studentService';

const TuitionPaymentModal = ({ open, onClose, student, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentService.recordPayment({
        student_id: student.id,
        amount_paid: amount,
        // package_id: 1 // Thực tế sẽ có dropdown chọn gói
      });
      alert(`Thu thành công ${amount} VNĐ từ học viên ${student.full_name}`);
      onSuccess();
      setAmount('');
      onClose();
    } catch (error) {
      alert("Lỗi khi ghi nhận học phí!");
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight="bold" sx={{ color: '#2e7d32' }}>Thu Tiền Học Phí</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1">
              Học viên: <b>{student.full_name}</b> (HV-{student.id})
            </Typography>
            <Divider />
            <TextField 
              label="Số tiền thu đợt này (VNĐ)" 
              type="number" required fullWidth 
              placeholder="Ví dụ: 2500000"
              value={amount} onChange={(e) => setAmount(e.target.value)} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Hủy</Button>
          <Button type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Xác Nhận Thu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TuitionPaymentModal;