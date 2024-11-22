import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button,Select, MenuItem, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar, Alert } from '@mui/material';
import DeleteConfirmDialog from '../EmployeesList/DeleteConfirmDialog'; 
import ExportButtonBrands from './ExportButtonBrands.js';

const BrandsList = () => {
  
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
    { field: 'name', headerName: 'Tên thương hiệu', width: 130 },
    { field: 'brandType', headerName: 'Dịch vụ', width: 130 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'location', headerName: 'Địa chỉ', width: 80 },
    { field: 'google', headerName: 'Google URL', width: 80 },
    { field: 'facebook', headerName: 'Facebook URL', width: 150 },
    { field: 'initDate', headerName: 'Ngày tạo', width: 180 },
  ];
  const paginationModel = { page: 0, pageSize: 7 };
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    brandType: 1,
    phone: '',
    location: '',
    google: '',
    facebook: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleClickOpen = () => {
    setFormData({
      name: '',
      brandType: 1,
      phone: '',
      location: '',
      google: '',
      facebook: ''
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
  // Handle add brand
  const [brandAdded, setBrandAdded] = useState(false);
  const handleAddSubmit = async () => {
    if (!validateForm()) return;
    try {
      const response = await fetch('http://localhost:8080/brand/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();

      if (response.ok) {
        showNotification('Thêm cửa hàng thành công');
        handleClose();
        setBrandAdded(!brandAdded);
      } else {
        showNotification(data.message || 'Thêm cửa hàng thất bại', 'error');
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      showNotification('Đã xảy ra lỗi khi thêm cửa hàng', 'error');
    }
  };
 // END ADD brand

 useEffect(() => {
  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:8080/brand/getAllBrands');
      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map((brand) => ({
          ...brand ,
          brandType: brand.brandType.name
        }));
        setRows(mappedData);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchBrands();
}, [brandAdded]);

// Handle Delete operation
const [brandToDelete, setBrandToDelete] = useState(null);
const [openDialog, setOpenDialog] = useState(false);

const handleDeleteClick = (brandId) => {
  setBrandToDelete(brandId);
  setOpenDialog(true); // Open the dialog
};


// Close the dialog without deleting
const handleCloseDialog = () => {
  setOpenDialog(false);
  setBrandToDelete(null);
};
const handleDelete = async () => {
  try {
    const response = await fetch(`http://localhost:8080/brand/delete/${brandToDelete}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== brandToDelete));
      showNotification('Xóa cửa hàng thành công');
    } else {
      showNotification('Xóa cửa hàng thất bại', 'error');
    }
  } catch (error) {
    console.error('Error deleting brand:', error);
    showNotification('Đã xảy ra lỗi khi xóa cửa hàng', 'error');
  }
  handleCloseDialog();
};

//// EDITTTTT
const handleEditClick = (brand) => {
  setFormData({
    id: brand.id,
    name: brand.name,
    brandType: brand.brandType, 
    phone: brand.phone,
    location: brand.location,
    google: brand.google,
    facebook: brand.facebook
  });
  setOpenEdit(true);
};

const handleSubmitEdit = async () => {
  if (!validateForm()) return;
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      showNotification('Vui lòng đăng nhập để thực hiện chức năng này', 'error');
      return;
    }

    const response = await fetch(`http://localhost:8080/brand/edit/${formData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        google: formData.google,
        facebook: formData.facebook
      }),
    });

    if (response.ok) {
      showNotification('Cập nhật thông tin thành công');
      setOpenEdit(false);
      setBrandAdded(!brandAdded);
    } else if (response.status === 401) {
      showNotification('ERROR AUTHORIZATION', 'error');
      // Optionally redirect to login page
    } else {
      const errorData = await response.text();
      showNotification(errorData || 'Cập nhật thông tin thất bại', 'error');
    }
  } catch (error) {
    console.error('Error updating brand:', error);
    showNotification('Đã xảy ra lỗi khi cập nhật thông tin', 'error');
  }
};
// END EDITT

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

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.location) {
      showNotification('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return false;
    }
    return true;
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button variant="contained" color="primary"  onClick={handleClickOpen}>Thêm cửa hàng</Button>
        <ExportButtonBrands />
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
        <DialogTitle>Thêm cửa hàng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên cửa hàng"
            type="text"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <Select
            margin="dense"
            label="Loại cửa hàng"
            fullWidth
            name="brandType"
            value={formData.brandType}
            onChange={handleInputChange}
            displayEmpty
          >
          <MenuItem value="" disabled>Chọn loại cửa hàng</MenuItem>
          <MenuItem value={1}>Ăn uống</MenuItem>
          <MenuItem value={2}>Giải trí</MenuItem>
          <MenuItem value={3}>Du lịch</MenuItem>
          <MenuItem value={4}>Mua sắm</MenuItem>
    </Select>
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
            label="Địa chỉ"
            type="text"
            fullWidth
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Google URL"
            type="text"
            fullWidth
            name="google"
            value={formData.google}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Facebook URL"
            type="text"
            fullWidth
            name="facebook"
            value={formData.facebook}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Huỷ</Button>
          <Button onClick={handleAddSubmit} color="primary">Thêm cửa hàng</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Chỉnh sửa thông tin cửa hàng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên cửa hàng"
            type="text"
            fullWidth
            name="name"
            value={formData.name}
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
            label="Địa chỉ"
            type="text"
            fullWidth
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Google URL"
            type="text"
            fullWidth
            name="google"
            value={formData.google}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Facebook URL"
            type="text"
            fullWidth
            name="facebook"
            value={formData.facebook}
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
export default BrandsList;
