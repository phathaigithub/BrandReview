import React from 'react';
import { Button } from '@mui/material';

const ExportButtonBrands = () => {
  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:8080/brands/export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'brands.xlsx');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Button variant="outlined" color="success" onClick={handleExport}>
      Xuất danh sách
    </Button>
  );
};

export default ExportButtonBrands;
