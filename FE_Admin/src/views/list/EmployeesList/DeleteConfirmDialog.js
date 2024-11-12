import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const DeleteConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xoá</DialogTitle>
      <DialogContent>
        <p>Bạn có chắc muốn xoá nhân viên này không?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Thoát</Button>
        <Button onClick={onConfirm} color="primary">Xác nhận</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
