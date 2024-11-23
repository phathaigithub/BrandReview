import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Box, Snackbar, Alert } from '@mui/material';
import { Tag, Image } from 'antd';

const ReviewList = () => {
  const [rows, setRows] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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

  const getStatusTag = (value) => {
    switch(value) {
      case 0: return <Tag color="blue">Bình thường</Tag>;
      case 1: return <Tag color="warning">Bị báo cáo</Tag>;
      case 2: return <Tag color="success">Hợp lệ</Tag>;
      default: return <Tag color="blue">Bình thường</Tag>;
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'userName', headerName: 'Người đánh giá', width: 130 },
    { field: 'brandName', headerName: 'Tên thương hiệu', width: 130 },
    { field: 'content', headerName: 'Nội dung', width: 200 },
    { field: 'initDate', headerName: 'Ngày đăng', width: 180, valueFormatter: (params) => formatDate(params) },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => getStatusTag(params.value)
    },
    { 
      field: 'images', 
      headerName: 'Hình ảnh', 
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        if (!params.row.images || params.row.images.length === 0) {
          return <span>Không có ảnh</span>;
        }
        
        return (
          <Image.PreviewGroup>
            {params.row.images.map((image, index) => (
              <Image
                key={index}
                src={`http://localhost:8080/uploads/${image.path}`}
                width={40}
                height={40}
                style={{ objectFit: 'cover', marginRight: '4px' }}
                preview={{
                  mask: index === 0 ? `${params.row.images.length} ảnh` : false,
                  maskClassName: 'custom-mask'
                }}
              />
            ))}
          </Image.PreviewGroup>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 200,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%'
        }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            disabled={params.row.status !== 1}
            size="small"
          >
            Xoá
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleMarkValid(params.row.id)}
            disabled={params.row.status !== 1}
            size="small"
          >
            Hợp lệ
          </Button>
        </Box>
      ),
    },
  ];

  const handleDelete = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/review/delete/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRows(rows.filter(row => row.id !== reviewId));
        showNotification('Xóa đánh giá thành công');
      } else {
        showNotification('Xóa đánh giá thất bại', 'error');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      showNotification('Đã xảy ra lỗi khi xóa đánh giá', 'error');
    }
  };

  const handleMarkValid = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:8080/review/markValid/${reviewId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setRows(rows.map(row => 
          row.id === reviewId 
            ? { ...row, status: 2 }
            : row
        ));
        showNotification('Đã đánh dấu đánh giá là hợp lệ');
      } else {
        showNotification('Không thể cập nhật trạng thái đánh giá', 'error');
      }
    } catch (error) {
      console.error('Error marking review as valid:', error);
      showNotification('Đã xảy ra lỗi khi cập nhật trạng thái', 'error');
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8080/review/getAllReviews');
        if (response.ok) {
          const data = await response.json();
          const mappedData = data.map(review => ({
            id: review.id,
            userName: review.userName || 'Unknown User',
            brandName: review.brandName || 'Unknown Brand',
            content: review.content,
            initDate: review.initDate,
            status: review.status,
            images: review.images || []
          }));
          console.log(mappedData);
          setRows(mappedData);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        showNotification('Không thể tải danh sách đánh giá', 'error');
      }
    };

    fetchReviews();
  }, []);

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

  return (
    <>
      <Paper sx={{ height: 'calc(80vh - 120px)', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } }
          }}
          pageSizeOptions={[5, 10]}
          disableSelectionOnClick
          sx={{
            border: 0,
            '.css-11cfq65-MuiTablePagination-displayedRows': {
              marginTop: '15px',
            },
          }}
        />
      </Paper>

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

export default ReviewList; 