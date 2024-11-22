import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, Select, MenuItem } from '@mui/material';
import DeleteConfirmDialog from '../EmployeesList/DeleteConfirmDialog';

const ContactList = () => {
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

  const getStatusLabel = (value) => {
    switch(value) {
      case 0: return { text: 'Chưa xử lý', class: 'bg-warning' };
      case 1: return { text: 'Đang xử lý', class: 'bg-info' };
      case 2: return { text: 'Đã xử lý', class: 'bg-success' };
      default: return { text: 'Chưa xử lý', class: 'bg-warning' };
    }
  };

  
  const columns = [
    {
      field: 'actions',
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
    { field: 'name', headerName: 'Tên khách hàng', width: 200 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'content', headerName: 'Nội dung hỗ trợ', width: 400 },
    { 
      field: 'initDate', 
      headerName: 'Ngày tạo', 
      width: 180,
      valueFormatter: (params) => {
        console.log('valueFormatter params:', params); // Debug log
        return formatDate(params);
      }
    },
    { 
      field: 'isexcuted', 
      headerName: 'Trạng thái', 
      width: 180,
      renderCell: (params) => {
        const status = getStatusLabel(params.value);
        return (
          <Select
            value={params.value || 0}
            onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
            className={status.class}
          >
            <MenuItem value={0}>Chưa xử lý</MenuItem>
            <MenuItem value={1}>Đang xử lý</MenuItem>
            <MenuItem value={2}>Đã xử lý</MenuItem>
          </Select>
        );
      },
    },
  ];

  const [rows, setRows] = useState([]);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch contacts data
  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:8080/contact/getAll');
      if (response.ok) {
        const data = await response.json();
        setRows(data);
      } else {
        console.error('Failed to fetch contact data');
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Handle status change
  const handleStatusChange = async (contactId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/contact/edit/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contactId,
          isexcuted: newStatus
        })
      });

      if (response.ok) {
        fetchContacts();
        alert('Cập nhật trạng thái thành công');
      } else {
        alert('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Đã xảy ra lỗi khi cập nhật trạng thái');
    }
  };

  // Handle Delete operation
  const handleDeleteClick = (contactId) => {
    setContactToDelete(contactId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setContactToDelete(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/contact/delete/${contactToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRows((prevRows) => prevRows.filter((row) => row.id !== contactToDelete));
        alert('Xóa yêu cầu hỗ trợ thành công');
      } else {
        alert('Không thể xóa yêu cầu hỗ trợ');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Đã xảy ra lỗi khi xóa yêu cầu hỗ trợ');
    }
    handleCloseDialog();
  };

  return (
    <>
      <Box sx={{ marginBottom: 2 }}>
        <h4>Danh sách yêu cầu hỗ trợ</h4>
      </Box>
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ 
            pagination: { paginationModel: { page: 0, pageSize: 7 } },
            sorting: {
              sortModel: [{ field: 'initDate', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{
            border: 0,
            '.css-11cfq65-MuiTablePagination-displayedRows': {
              marginTop: '15px',
            },
          }}
        />
      </Paper>

      <DeleteConfirmDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ContactList;
