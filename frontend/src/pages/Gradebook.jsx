// frontend/src/pages/Gradebook.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, 
  FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import gradeService from '../services/gradeService';

const Gradebook = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Tải danh sách lớp khi vào trang
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await gradeService.getClasses();
        setClasses(data);
      } catch (error) {
        console.error("Lỗi tải danh sách lớp:", error);
      }
    };
    fetchClasses();
  }, []);

  // Tải bảng điểm khi chọn 1 Lớp
  useEffect(() => {
    if (!selectedClass) return;
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const data = await gradeService.getGradesByClass(selectedClass);
        setGrades(data);
        setMessage({ type: '', text: '' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Không thể tải dữ liệu điểm!' });
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [selectedClass]);

  // Hàm xử lý khi Giáo viên gõ điểm/nhận xét vào ô input
  const handleGradeChange = (recordId, field, value) => {
    setGrades((prevGrades) =>
      prevGrades.map((grade) =>
        grade.id === recordId ? { ...grade, [field]: value } : grade
      )
    );
  };

  // Nút: Lưu Nháp
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await gradeService.saveDraft(grades);
      setMessage({ type: 'success', text: 'Đã lưu nháp bảng điểm thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi khi lưu nháp!' });
    } finally {
      setSaving(false);
    }
  };

  // Nút: Chốt điểm
  const handleSubmitGrades = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn chốt điểm? Sau khi chốt sẽ gửi thẳng cho Giáo vụ và không thể tự sửa.")) return;
    setSaving(true);
    try {
      await gradeService.saveDraft(grades); // Lưu trước cho chắc
      await gradeService.submitGrades(selectedClass);
      
      // Cập nhật lại UI: Khóa tất cả các ô input
      setGrades(grades.map(g => ({ ...g, is_finalized: true })));
      setMessage({ type: 'success', text: 'Đã chốt sổ điểm và gửi Giáo vụ!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Lỗi khi chốt điểm!' });
    } finally {
      setSaving(false);
    }
  };

  // Kiểm tra xem lớp này đã bị chốt sổ chưa (Nếu 1 học sinh bị chốt coi như cả lớp chốt)
  const isFinalized = grades.length > 0 && grades[0].is_finalized;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Sổ Điểm 4 Kỹ Năng (IELTS/TOEIC)
      </Typography>

      {/* Chọn Lớp Học */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 300 }} size="small">
          <InputLabel>Chọn Lớp Học</InputLabel>
          <Select
            value={selectedClass}
            label="Chọn Lớp Học"
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name} ({cls.course_name})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>
      )}

      {/* Bảng Ma Trận Điểm */}
      {selectedClass && (
        <Paper elevation={3}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
          ) : grades.length === 0 ? (
            <Typography sx={{ p: 3, textAlign: 'center' }}>Lớp này chưa có học sinh nào được xếp vào.</Typography>
          ) : (
            <>
              {/* Vùng Bảng cuộn ngang */}
              <TableContainer sx={{ maxHeight: '60vh', overflowX: 'auto' }}>
                <Table stickyHeader sx={{ minWidth: 1200 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell rowSpan={2} sx={{ backgroundColor: '#f0f4f8', minWidth: 200, fontWeight: 'bold' }}>Tên Học Viên</TableCell>
                      <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>Nghe (Listening)</TableCell>
                      <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#fff3e0', fontWeight: 'bold' }}>Nói (Speaking)</TableCell>
                      <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#e8f5e9', fontWeight: 'bold' }}>Đọc (Reading)</TableCell>
                      <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#fce4ec', fontWeight: 'bold' }}>Viết (Writing)</TableCell>
                    </TableRow>
                    <TableRow>
                      {/* Lặp 4 lần cho 4 kỹ năng */}
                      {[1, 2, 3, 4].map((i) => (
                        <React.Fragment key={i}>
                          <TableCell align="center" sx={{ minWidth: 80 }}>Điểm</TableCell>
                          <TableCell align="center" sx={{ minWidth: 200 }}>Nhận xét (Feedback)</TableCell>
                        </React.Fragment>
                      ))}
                    </TableRow>
                  </TableHead>
                  
                  <TableBody>
                    {grades.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ fontWeight: 'bold' }}>{row.student_name || `Học viên ID: ${row.student}`}</TableCell>
                        
                        {/* Cột NGHE */}
                        <TableCell>
                          <TextField size="small" type="number" value={row.listening_score || ''} disabled={isFinalized}
                            onChange={(e) => handleGradeChange(row.id, 'listening_score', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" fullWidth multiline maxRows={3} value={row.listening_fb || ''} disabled={isFinalized}
                            onChange={(e) => handleGradeChange(row.id, 'listening_fb', e.target.value)} />
                        </TableCell>

                        {/* Cột NÓI */}
                        <TableCell>
                          <TextField size="small" type="number" value={row.speaking_score || ''} disabled={isFinalized}
                            onChange={(e) => handleGradeChange(row.id, 'speaking_score', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" fullWidth multiline maxRows={3} value={row.speaking_fb || ''} disabled={isFinalized}
                            onChange={(e) => handleGradeChange(row.id, 'speaking_fb', e.target.value)} />
                        </TableCell>

                        {/* Cột ĐỌC */}
                        <TableCell>
                          <TextField size="small" type="number" value={row.reading_score || ''} disabled={isFinalized}
                            onChange={(e) => handleGradeChange(row.id, 'reading_score', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" fullWidth multiline maxRows={3} value={row.reading_fb || ''} disabled={isFinalized}
                            onChange={(e) => handleGradeChange(row.id, 'reading_fb', e.target.value)} />
                        </TableCell>

                        {/* Cột VIẾT */}
                        <TableCell>
                          <TextField size="small" type="number" value={row.writing_score || ''} disabled={isFinalized}
                            onChange={(e) => handleGradeChange(row.id, 'writing_score', e.target.value)} />
                        </TableCell>
                        <TableCell>
                          <TextField size="small" fullWidth multiline maxRows={3} value={row.writing_fb || ''} disabled={isFinalized}
                            onChange={(e) => handleGradeChange(row.id, 'writing_fb', e.target.value)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Thanh Hành Động */}
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, backgroundColor: '#fafafa', borderTop: '1px solid #eee' }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<SaveIcon />} 
                  onClick={handleSaveDraft}
                  disabled={saving || isFinalized}
                >
                  Lưu Nháp (Chưa gửi)
                </Button>
                <Button 
                  variant="contained" 
                  color="success" 
                  startIcon={<SendIcon />} 
                  onClick={handleSubmitGrades}
                  disabled={saving || isFinalized}
                >
                  Chốt Điểm & Gửi Giáo Vụ
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default Gradebook;