// frontend/src/pages/CourseStructure.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemButton, ListItemText, Divider, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button } from '@mui/material';
import academicService from '../services/academicService';
import CreateClassModal from '../components/CreateClassModal';


const CourseStructure = () => {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isClassModalOpen, setClassModalOpen] = useState(false);


  useEffect(() => {
    academicService.getCourses().then(setCourses).catch(console.error);
  }, []);

  const handleSelectCourse = async (course) => {
    setSelectedCourse(course);
    try {
      const data = await academicService.getClassesByCourse(course.id);
      setClasses(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Cấu trúc Khóa học & Lớp học</Typography>
      
      <Grid container spacing={3}>
        {/* Cột trái: Danh sách Khóa */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ height: '70vh', overflow: 'auto' }}>
            <Box sx={{ p: 2, backgroundColor: '#1976d2', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Danh sách Khóa</Typography>
              <Button size="small" variant="contained" color="secondary">+</Button>
            </Box>
            <List disablePadding>
              {courses.map(course => (
                <React.Fragment key={course.id}>
                  <ListItem disablePadding>
                    <ListItemButton 
                      selected={selectedCourse?.id === course.id}
                      onClick={() => handleSelectCourse(course)}
                    >
                      <ListItemText primary={course.name} secondary={`Cơ sở: ${course.branch_name}`} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
              {courses.length === 0 && <Typography sx={{ p: 2 }}>Chưa có khóa học nào.</Typography>}
            </List>
          </Paper>
        </Grid>

        {/* Cột phải: Danh sách Lớp */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {selectedCourse ? `Các Lớp thuộc: ${selectedCourse.name}` : 'Vui lòng chọn 1 Khóa học'}
              </Typography>
              {selectedCourse && (
                <Button variant="outlined" size="small" onClick={() => setClassModalOpen(true)}>
                  + Thêm Lớp
                </Button>
              )}
            </Box>
            <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1 }}>
              {!selectedCourse ? (
                <Typography color="textSecondary" align="center" sx={{ mt: 10 }}>Chọn một khóa học bên trái để xem chi tiết.</Typography>
              ) : (
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><b>Mã Lớp</b></TableCell>
                      <TableCell><b>Band Điểm</b></TableCell>
                      <TableCell><b>Giáo viên</b></TableCell>
                      <TableCell><b>Trạng thái</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classes.map(cls => (
                      <TableRow key={cls.id} hover>
                        <TableCell>{cls.name}</TableCell>
                        <TableCell><Chip label={cls.band_name} size="small" color="primary" variant="outlined"/></TableCell>
                        <TableCell>{cls.teacher_name || 'Chưa phân công'}</TableCell>
                        <TableCell>{cls.status}</TableCell>
                      </TableRow>
                    ))}
                    {classes.length === 0 && (
                      <TableRow><TableCell colSpan={4} align="center">Khóa này chưa có lớp nào.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {selectedCourse && (<CreateClassModal open={isClassModalOpen} onClose={() => setClassModalOpen(false)} courseId={selectedCourse.id} onSuccess={() => handleSelectCourse(selectedCourse)} />)}
    </Box>
  );
};

export default CourseStructure;