import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar, Alert, Select, MenuItem } from '@mui/material';
import DeleteConfirmDialog from './DeleteConfirmDialog'; 
import ExportButton from './ExportButton';

const EmployeesList = () => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Tên đăng nhập', width: 130 },
    { field: 'name', headerName: 'Tên nhân viên', width: 150 },
    { field: 'gender', headerName: 'Giới tính', width: 80 },
    { field: 'birth', headerName: 'Ngày sinh', width: 80 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'email', headerName: 'Email', width: 220 },
    { 
      field: 'positionName', 
      headerName: 'Vị trí', 
      width: 150,
      renderCell: (params) => {
        console.log('Position:', params.value);
        const value = params.value;
        if (value === 'CustomerEmployee') return 'Nhân viên CSKH';
        if (value === 'Employee') return 'Nhân viên';
        if (value === 'Manager') return 'Quản lý';
        return value;
      }
    },
    { 
      field: 'initDate', 
      headerName: 'Ngày tạo', 
      width: 180,
      valueFormatter: (params) => formatDate(params)
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <button
          type="button"
          className="btn btn-primary text-white"
          onClick={() => handleEditClick(params.row)}
        >
          Chỉnh sửa
        </button>
      ),
    },
    {
      field: 'actions2',
      headerName: '',
      width: 110,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <button
          type="button"
          className="btn btn-danger text-white"
          onClick={() => handleDeleteClick(params.row.id)}
        >
          Xoá
        </button>
      ),
    },
  ];
  const paginationModel = { page: 0, pageSize: 7 };
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false)
  const positions = [
    { id: 2, name: 'Quản lý' },
    { id: 3, name: 'Nhân viên' },
    { id: 4, name: 'Nhân viên CSKH' }
  ];
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
    name: '',
    birth: '',
    gender: '',
    position: ''
  });

  const handleClickOpen = () => {
    setFormData({
      id:'',
      username: '',
      password: '', // Leave blank if password shouldn't be shown
      phone: '',
      email: '',
      name:'',
      birth: '',
      gender: '',
      position: ''
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleClickOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Handle add employee
  const [employeeAdded, setEmployeeAdded] = useState(false);
  const handleAddSubmit = async () => {
    if (!validateForm()) return;
    try {
      const formattedData = {
        ...formData,
        position: formData.position ? { id: parseInt(formData.position) } : null,
        isEnable: true
      };

      const response = await fetch('http://localhost:8080/employee/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Thêm nhân viên thất bại');
      }

      showNotification('Thêm nhân viên thành công');
      handleClose();
      setEmployeeAdded(!employeeAdded);
    } catch (error) {
      showNotification(error.message || 'Đã xảy ra lỗi khi thêm nhân viên', 'error');
    }
  };
 // END ADD EMPOYEE

 useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/employee/getAll');
      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map((employee) => ({
          ...employee,
          positionName: employee.position?.name || '',
        }));
        setRows(mappedData);
      } else {
        showNotification('Không thể tải dữ liệu nhân viên', 'error');
      }
    } catch (error) {
      showNotification('Đã xảy ra lỗi khi tải dữ liệu nhân viên', 'error');
    }
  };

  fetchEmployees();
}, [employeeAdded]);

// Handle Delete operation
const [employeeToDelete, setEmployeeToDelete] = useState(null);
const [openDialog, setOpenDialog] = useState(false);

const handleDeleteClick = (employeeId) => {
  setEmployeeToDelete(employeeId);
  setOpenDialog(true); // Open the dialog
};


// Close the dialog without deleting
const handleCloseDialog = () => {
  setOpenDialog(false);
  setEmployeeToDelete(null);
};
const handleDelete = async () => {
  try {
    const response = await fetch(`http://localhost:8080/employee/delete/${employeeToDelete}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Xóa nhân viên thất bại');
    }

    setRows((prevRows) => prevRows.filter((row) => row.id !== employeeToDelete));
    showNotification('Xóa nhân viên thành công');
  } catch (error) {
    showNotification(error.message || 'Đã xảy ra lỗi khi xóa nhân viên', 'error');
  }
  handleCloseDialog();
};

//// EDITTTTT
const handleEditClick = (employee) => {
  setFormData({
    ...employee,
    position: employee.position?.id || '',
    password: ''
  });
  setOpenEdit(true);
};

const handleSubmitEdit = async () => {
  if (!validateForm()) return;
  try {
    const formattedData = {
      ...formData,
      position: formData.position ? { id: parseInt(formData.position) } : null,
      isEnable: true
    };

    if (!formattedData.password || formattedData.password.trim() === '') {
      delete formattedData.password;
    }

    const response = await fetch(`http://localhost:8080/employee/edit/${formData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Cập nhật thông tin thất bại');
    }

    showNotification('Cập nhật thông tin thành công');
    setOpenEdit(false);
    setEmployeeAdded(!employeeAdded);
  } catch (error) {
    showNotification(error.message || 'Đã xảy ra lỗi khi cập nhật thông tin', 'error');
  }
};
// END EDITT

  // Add snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Add validation function
  const validateForm = () => {
    const phoneRegex = /^[0-9]+$/;
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/; // Allows letters, Vietnamese characters and spaces
    
    if (!formData.username) {
      showNotification('Vui lòng nhập tên đăng nhập', 'error');
      return false;
    }
    
    // Enhanced name validation
    if (!formData.name) {
      showNotification('Vui lòng nhập tên nhân viên', 'error');
      return false;
    }
    if (formData.name.trim().length < 2) {
      showNotification('Tên nhân viên phải có ít nhất 2 ký tự', 'error');
      return false;
    }
    if (!nameRegex.test(formData.name)) {
      showNotification('Tên nhân viên chỉ được chứa chữ cái và khoảng trắng', 'error');
      return false;
    }
    if (formData.name.trim().length > 50) {
      showNotification('Tên nhân viên không được vượt quá 50 ký tự', 'error');
      return false;
    }
    
    if (!formData.position) {
      showNotification('Vui lòng chọn vị trí', 'error');
      return false;
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      showNotification('Số điện thoại không hợp lệ. Vui lòng chỉ nhập số', 'error');
      return false;
    }

    if (formData.gender && !['Nam', 'Nữ'].includes(formData.gender)) {
      showNotification('Giới tính chỉ có thể là Nam hoặc Nữ', 'error');
      return false;
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showNotification('Email không hợp lệ', 'error');
        return false;
      }
    }

    return true;
  };

  // Replace the gender TextField with Select in both dialogs
  const genderField = (
    <TextField
      select
      margin="dense"
      fullWidth
      name="gender"
      value={formData.gender}
      onChange={handleInputChange}
      SelectProps={{
        native: true,
      }}
    >
      <option value="">Chọn giới tính</option>
      <option value="Nam">Nam</option>
      <option value="Nữ">Nữ</option>
    </TextField>
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button variant="contained" color="primary"  onClick={handleClickOpen}>Thêm nhân viên</Button>
        <ExportButton />
      </Box>
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          sx={{
            border: 0,
            '.css-11cfq65-MuiTablePagination-displayedRows': {
              marginTop: '15px',
            },
          }}
        />
      </Paper>

      {/* Popup Register Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thêm nhân viên</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên đăng nhập"
            type="text"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Mật khẩu"
            type="password"
            fullWidth
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Tên nhân viên"
            type="text"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField 
            margin="dense"
            label="Ngày sinh"
            type="date"
            fullWidth
            name="birth"
            value={formData.birth}
            onChange={handleInputChange}
            InputLabelProps={{
              
              shrink: true, // keeps the label visible above the date input
            }}
          />
          {genderField}
          <TextField
            margin="dense"
            label="Số điện thoại"
            type="text"
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            select
            margin="dense"
            fullWidth
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Chọn vị trí</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Huỷ</Button>
          <Button onClick={handleAddSubmit} color="primary">Thêm nhân viên</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên đăng nhập"
            type="text"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Mật khẩu"
            type="password"
            fullWidth
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Tên nhân viên"
            type="text"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField 
            margin="dense"
            label="Ngày sinh"
            type="date"
            fullWidth
            name="birth"
            value={formData.birth}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          {genderField}
          <TextField
            margin="dense"
            label="Số điện thoại"
            type="text"
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            select
            margin="dense"
            label="Vị trí"
            fullWidth
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            SelectProps={{
              native: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            <option value="">Chọn vị trí</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="secondary">Huỷ</Button>
          <Button onClick={handleSubmitEdit} color="primary">Cập nhật</Button>
        </DialogActions>
      </Dialog>


      
      <DeleteConfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
);
};
export default EmployeesList;
