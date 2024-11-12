import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import DeleteConfirmDialog from './DeleteConfirmDialog'; // Import the new DeleteConfirmDialog component



const EmployeesList = () => {
  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <button
          type="button"
          className="btn btn-warning text-white"
          onClick={(event) => {
            event.stopPropagation();
          }}
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
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Tên đăng nhập', width: 130 },
    { field: 'name', headerName: 'Tên nhân viên', width: 150 },
    { field: 'gender', headerName: 'Giới tính', width: 80 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'positionName', headerName: 'Vị trí', width: 150 }, 
    { field: 'initDate', headerName: 'Ngày tạo', width: 180 },
  ];
  const paginationModel = { page: 0, pageSize: 7 };
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phone: '',
    email: '',
    name: '',
    birth: '',
    gender: ''
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
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
        // Reload the employee data here if needed
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
}, []);

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

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button variant="contained" color="primary"  onClick={handleClickOpen}>Thêm nhân viên</Button>
        <Button variant="outlined" color="success">Xuất danh sách</Button>
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
        <DialogTitle>Register Employee</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Phone"
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
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Birth Date"
            type="date"
            fullWidth
            name="birth"
            value={formData.birth}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Gender"
            type="text"
            fullWidth
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Huỷ</Button>
          <Button onClick={handleSubmit} color="primary">Thêm nhân viên</Button>
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
