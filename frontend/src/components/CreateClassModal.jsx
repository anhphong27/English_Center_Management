// frontend/src/components/CreateClassModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import academicService from '../services/academicService';

const CreateClassModal = ({ open, onClose, courseId, onSuccess }) => {
  const [className, setClassName] = useState('');
  const [bandId, setBandId] = useState('');
  const [loading, setLoading] = useState(false);
  const [bands, setBands] = useState([]); // State lưu danh sách Band thật
  const [errorMsg, setErrorMsg] = useState(''); // State hiển thị lỗi rõ ràng

  // Gọi API lấy danh sách Band khi mở Modal
  useEffect(() => {
    if (open) {
      academicService.getBands()
        .then(data => setBands(data))
        .catch(err => console.error("Lỗi tải danh sách Band:", err));
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await academicService.createClass({
        course: courseId,
        name: className,
        band: bandId,
        status: 'PENDING'
      });
      
      onSuccess();
      setClassName(''); 
      setBandId('');
      onClose();
    } catch (error) {
      // In lỗi chi tiết ra màn hình để biết chính xác Backend đang chê trường nào
      console.error("Lỗi chi tiết từ Backend: ", error.response?.data);
      
      if (error.response?.data) {
        // Biến object lỗi thành một chuỗi văn bản để hiển thị
        const errorDetails = Object.entries(error.response.data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' | ');
        setErrorMsg(`Lỗi dữ liệu: ${errorDetails}`);
      } else {
        setErrorMsg("Có lỗi xảy ra không xác định!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight="bold">Thêm Lớp Học Mới</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          
          {/* Hiển thị lỗi rõ ràng nếu có */}
          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField 
              label="Mã/Tên Lớp (VD: IL-45-01)" 
              required fullWidth 
              value={className} onChange={(e) => setClassName(e.target.value)} 
            />
            <FormControl fullWidth required>
              <InputLabel>Thuộc Band Điểm</InputLabel>
              <Select 
                value={bandId} 
                label="Thuộc Band Điểm" 
                onChange={(e) => setBandId(e.target.value)}
              >
                {/* Render danh sách Band động từ DB */}
                {bands.length === 0 ? (
                  <MenuItem value="" disabled>Chưa có Band nào trong Database</MenuItem>
                ) : (
                  bands.map(b => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">Hủy</Button>
          <Button type="submit" variant="contained" disabled={loading || bands.length === 0}>
            {loading ? 'Đang tạo...' : 'Tạo Lớp'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateClassModal;