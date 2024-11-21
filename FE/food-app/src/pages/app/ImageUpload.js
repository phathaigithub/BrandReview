import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';

const ImageUpload = ({ onUpload }) => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Extract file objects for the parent form
    const uploadedFiles = newFileList
      .filter((file) => file.status === 'done' || file.originFileObj) // Filter for valid files
      .map((file) => file.originFileObj); // Get the File object, not URL or base64

    // Pass the files to the parent component
    onUpload(uploadedFiles);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      listType="picture-card"
      customRequest={({ file, onSuccess }) => {
        // You can remove this if you are not performing a mock upload
        setTimeout(() => {
          onSuccess("ok");
        }, 0); // Mock upload
      }}
      onChange={handleChange}
      fileList={fileList}
    >
      {fileList.length >= 5 ? null : uploadButton} {/* Limit uploads to 5 */}
    </Upload>
  );
};

export default ImageUpload;
