import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
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
    { field: 'positionName', headerName: 'Vị trí', width: 150 }, 
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

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
    name: '',
    birth: '',
    gender: ''
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
    try {
      const response = await fetch('http://localhost:8080/employee/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Employee added successfully');
        handleClose();
        setEmployeeAdded(!employeeAdded);
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error occurred while adding employee');
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
          positionName: employee.position?.name || '', // Extract name from position object
        }));
        setRows(mappedData);
      } else {
        console.error('Failed to fetch employee data');
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
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
const handleDelete = async (employeeId) => {

  try {
    const response = await fetch(`http://localhost:8080/employee/delete/${employeeToDelete}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Update the state to remove the deleted employee
      setRows((prevRows) => prevRows.filter((row) => row.id !== employeeToDelete));
    } else {
      alert('Failed to delete employee');
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    alert('Error occurred while deleting employee');
  }
  handleCloseDialog();
};

//// EDITTTTT
const handleEditClick = (employee) => {
  setFormData({
    id: employee.id,
    username: employee.username,
    password: employee.password, // Leave blank if password shouldn't be shown
    phone: employee.phone,
    email: employee.email,
    name: employee.name,
    birth: employee.birth,
    gender: employee.gender,
  });
  setOpenEdit(true);
};

const handleSubmitEdit = async () => {
  try {
    const response = await fetch(`http://localhost:8080/employee/edit/${formData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Employee updated successfully');
      handleClose();
      setEmployeeAdded(!employeeAdded);
      setOpenEdit(false);
    } else {
      alert('Failed to update employee');
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    alert('Error occurred while updating employee');
  }
};
// END EDITT

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
          <TextField
            margin="dense"
            label="Giới tính"
            type="text"
            fullWidth
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          />
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
          <TextField
            margin="dense"
            label="Giới tính"
            type="text"
            fullWidth
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          />
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
    </>
);
};
export default EmployeesList;
