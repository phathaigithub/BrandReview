import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button,Select, MenuItem, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar, Alert, FormHelperText } from '@mui/material';
import DeleteConfirmDialog from '../EmployeesList/DeleteConfirmDialog'; 
import ExportButtonBrands from './ExportButtonBrands.js';

const BrandsList = () => {
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
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'name', headerName: 'Tên thương hiệu', width: 130 },
    { field: 'brandType', headerName: 'Dịch vụ', width: 80 },
    { field: 'phone', headerName: 'Số điện thoại', width: 110 },
    { field: 'location', headerName: 'Địa chỉ', width: 200 },
    { field: 'google', headerName: 'Google URL', width: 150 },
    { field: 'facebook', headerName: 'Facebook URL', width: 150 },
    { field: 'initDate', headerName: 'Ngày tạo', width: 180, valueFormatter: (params) => formatDate(params) },
    { field: 'priority', headerName: 'Độ ưu tiên', width: 100 },
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
  const paginationModel = { page: 0, pageSize: 20 };
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    brandType: 1,
    phone: '',
    streetAddress: '',
    district: '',
    city: 'TPHCM',
    google: '',
    facebook: '',
    image: null,
    priority: 0
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleClickOpen = () => {
    setFormData({
      name: '',
      brandType: 1,
      phone: '',
      streetAddress: '',
      district: '',
      city: 'TPHCM',
      google: '',
      facebook: '',
      image: null,
      priority: 0
    });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setImagePreview(null);
  };

  const handleClickOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevData => {
      const newData = {
        ...prevData,
        [name]: value,
      };

      if (['streetAddress', 'district', 'city'].includes(name)) {
        const combinedLocation = [
          newData.streetAddress,
          newData.district,
          newData.city
        ].filter(Boolean).join(', ');
        
        newData.location = combinedLocation;
      }

      return newData;
    });
  };

  const splitLocation = (location) => {
    if (!location) return { streetAddress: '', district: '', city: 'TPHCM' };

    const parts = location.split(', ');
    let streetAddress = '', district = '', city = 'TPHCM';

    if (parts.length >= 3) {
      city = parts.pop();
      district = parts.pop();
      streetAddress = parts.join(', ');
    } else if (parts.length === 2) {
      district = parts.pop();
      streetAddress = parts.join(', ');
    } else if (parts.length === 1) {
      streetAddress = parts[0];
    }

    return { streetAddress, district, city };
  };

  const handleEditClick = (brand) => {
    const { streetAddress, district, city } = splitLocation(brand.location);
    
    setFormData({
      id: brand.id,
      name: brand.name,
      brandType: brand.brandType,
      phone: brand.phone,
      location: brand.location,
      streetAddress,
      district,
      city,
      google: brand.google,
      facebook: brand.facebook,
      priority: brand.priority || 0,
      image: null
    });
    setImagePreview(brand.image ? `http://localhost:8080/uploads/${brand.image}` : null);
    setOpenEdit(true);
  };

  const renderAddressFields = () => (
    <>
      <TextField
        margin="dense"
        label="Địa chỉ/ phường"
        type="text"
        fullWidth
        name="streetAddress"
        value={formData.streetAddress}
        onChange={handleInputChange}
        required
        placeholder="Ví dụ: 22 Lê Trọng Tấn, phường Tây Thạnnh"
      />
      <Select
        margin="dense"
        fullWidth
        name="district"
        value={formData.district}
        onChange={handleInputChange}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Chọn Quận *
        </MenuItem>
        <MenuItem value="Quận 1">Quận 1</MenuItem>
        <MenuItem value="Quận 2">Quận 2</MenuItem>
        <MenuItem value="Quận 3">Quận 3</MenuItem>
        <MenuItem value="Quận 4">Quận 4</MenuItem>
        <MenuItem value="Quận 5">Quận 5</MenuItem>
        <MenuItem value="Quận 6">Quận 6</MenuItem>
        <MenuItem value="Quận 7">Quận 7</MenuItem>
        <MenuItem value="Quận 8">Quận 8</MenuItem>
        <MenuItem value="Quận 9">Quận 9</MenuItem>
        <MenuItem value="Quận 10">Quận 10</MenuItem>
        <MenuItem value="Quận 11">Quận 11</MenuItem>
        <MenuItem value="Quận 12">Quận 12</MenuItem>
        <MenuItem value="Quận Phú Nhuận">Quận Phú Nhuận</MenuItem>
        <MenuItem value="Quận Bình Thạnh">Quận Bình Thạnh</MenuItem>
        <MenuItem value="Quận Tân Bình">Quận Tân Bình</MenuItem>
        <MenuItem value="Quận Tân Phú">Quận Tân Phú</MenuItem>
        <MenuItem value="Quận Gò Vấp">Quận Gò Vấp</MenuItem>
        <MenuItem value="Quận Bình Tân">Quận Bình Tân</MenuItem>
      </Select>
      <TextField
        margin="dense"
        label="Thành phố"
        type="text"
        fullWidth
        name="city"
        value={formData.city}
        onChange={handleInputChange}
        disabled
      />
    </>
  );

  // Handle add brand
  const [brandAdded, setBrandAdded] = useState(false);
  const handleAddSubmit = async () => {
    if (!validateForm()) return;
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        showNotification('Vui lòng đăng nhập để thực hiện chức năng này', 'error');
        return;
      }

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('location', formData.location);
      // Handle google URL - extract from iframe if needed
      const googleUrl = formData.google.includes('<iframe') 
        ? (formData.google.match(/src="([^"]+)"/) || [])[1] || formData.google
        : formData.google;
      formDataToSend.append('google', googleUrl);
      formDataToSend.append('facebook', formData.facebook);
      formDataToSend.append('brandType', JSON.stringify({
        id: formData.brandType,
        name: getBrandTypeName(formData.brandType)
      }));
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('http://localhost:8080/brand/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Remove Content-Type header to let browser set it with boundary for FormData
        },
        body: formDataToSend,
      });
      
      if (response.ok) {
        showNotification('Thêm cửa hàng thành công');
        handleClose();
        setBrandAdded(!brandAdded);
      } else if (response.status === 401) {
        showNotification('Vui lòng đăng nhập lại để thực hiện chức năng này', 'error');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Thêm cửa hàng thất bại', 'error');
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
const handleSubmitEdit = async () => {
  if (!validateForm()) return;
  try {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      showNotification('Vui lòng đăng nhập để thực hiện chức năng này', 'error');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('location', formData.location);
    // Handle google URL - extract from iframe if needed
    const googleUrl = formData.google.includes('<iframe') 
      ? (formData.google.match(/src="([^"]+)"/) || [])[1] || formData.google
      : formData.google;
    formDataToSend.append('google', googleUrl);
    formDataToSend.append('facebook', formData.facebook);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    formDataToSend.append('priority', formData.priority);

    const response = await fetch(`http://localhost:8080/brand/edit/${formData.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formDataToSend,
    });

    if (response.ok) {
      showNotification('Cập nhật thông tin thành công');
      setOpenEdit(false);
      setBrandAdded(!brandAdded);
    } else if (response.status === 401) {
      showNotification('ERROR AUTHORIZATION', 'error');
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
    // Add phone validation
    const phoneRegex = /^[0-9]+$/;
    
    // Check required fields including district
    if (!formData.name || !formData.streetAddress || !formData.district) {
      showNotification('Vui lòng điền đầy đủ thông tin: Tên cửa hàng, địa chỉ và quận', 'error');
      return false;
    }

    // Validate phone number if provided
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      showNotification('Số điện thoại không hợp lệ. Vui lòng chỉ nhập số', 'error');
      return false;
    }

    // Validate Google URL
    if (!formData.google) {
      showNotification('Vui lòng nhập Google URL', 'error');
      return false;
    }

    return true;
  };

  // Add this helper function to get the brand type name
  const getBrandTypeName = (id) => {
    switch (parseInt(id)) {
      case 1:
        return "Ăn uống";
      case 2:
        return "Giải trí";
      case 3:
        return "Du lịch";
      case 4:
        return "Mua sắm";
      default:
        return "";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>Thêm cửa hàng</Button>
        <ExportButtonBrands />
      </Box>
      <Paper sx={{ height: 'calc(80vh - 120px)', width: '100%' }}>
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
            required
          />
          <Select
            margin="dense"
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
            inputProps={{
              pattern: '[0-9]*'
            }}
          />
          {renderAddressFields()}
          <TextField
            margin="dense"
            label="Google URL"
            type="text"
            fullWidth
            name="google"
            value={formData.google}
            onChange={handleInputChange}
            required
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
          <Box sx={{ mt: 2 }}>
            <TextField
              type="file"
              fullWidth
              inputProps={{
                accept: 'image/*'
              }}
              onChange={handleFileChange}
            />
            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            )}
          </Box>
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
            inputProps={{
              pattern: '[0-9]*'
            }}
          />
          {renderAddressFields()}
          <TextField
            margin="dense"
            label="Google URL"
            type="text"
            fullWidth
            name="google"
            value={formData.google}
            onChange={handleInputChange}
            required
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
          <TextField
            margin="dense"
            label="Độ ưu tiên"
            type="number"
            fullWidth
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            inputProps={{
              min: 0,
              step: 1
            }}
          />
          <Box sx={{ mt: 2 }}>
            <TextField
              type="file"
              fullWidth
              inputProps={{
                accept: 'image/*'
              }}
              onChange={handleFileChange}
            />
            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            )}
          </Box>
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
