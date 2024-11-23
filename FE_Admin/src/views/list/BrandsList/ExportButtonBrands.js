import React from 'react';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ExportButtonBrands = () => {
  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:8080/brand/export', {
        method: 'GET',
      });

      if (response.ok) {
        // Get the blob from the response
        const blob = await response.blob();
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'brands.xlsx'; // Set the file name
        
        // Append link to body, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handleExport}
      startIcon={<FileDownloadIcon />}
    >
      Xuất danh sách
    </Button>
  );
};

export default ExportButtonBrands;
