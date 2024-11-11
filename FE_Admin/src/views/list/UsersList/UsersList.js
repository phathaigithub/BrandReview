import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button, Box } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  {
    field: 'actions',
    headerName: '',
    width: 120,
    sortable: false,
    renderCell: (params) => (
        <button 
        type="button" 
        class="btn btn-warning text-white"
        onClick={(event) => {
            event.stopPropagation(); 
          }}
        >
            Chỉnh sửa
        </button>
    )
    },
    {
    field: 'actions2',
    headerName: '',
    width: 110,
    sortable: false,
    renderCell: (params) => (
        <button 
        type="button" 
        class="btn btn-danger text-white"
        onClick={(event) => {
            event.stopPropagation(); 
          }}
        >
            Xoá
            </button> 
    )
    },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 7 };

const UsersList = () => {
  return (
    <>
    <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <Button variant="contained" color="primary">Thêm người dùng</Button>
        <Button variant="outlined" color="success">Xuất danh sách</Button>
    </Box>
    <Paper sx={{ height: 500, width: '100%' }}>
        
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }} 
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          border: 0,
          '.css-11cfq65-MuiTablePagination-displayedRows': {
            marginTop: '15px',
          },
        }}
      />
    </Paper>
    </>
  );
}



export default UsersList;