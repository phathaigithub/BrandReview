import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ChangePasswordTab = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (password.includes(' ')) {
      return 'Mật khẩu không được chứa khoảng trắng';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });

    // Validate new password
    if (name === 'newPassword') {
      const passwordError = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        newPassword: passwordError
      }));

      // Check confirm password match if it's already entered
      if (passwords.confirmPassword) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: value !== passwords.confirmPassword ? 'Mật khẩu không khớp' : ''
        }));
      }
    }

    // Validate confirm password
    if (name === 'confirmPassword') {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== passwords.newPassword ? 'Mật khẩu không khớp' : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate before submission
    const newPasswordError = validatePassword(passwords.newPassword);
    if (newPasswordError) {
      setErrors(prev => ({
        ...prev,
        newPassword: newPasswordError
      }));
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Mật khẩu không khớp'
      }));
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const response = await axios.put(
        `http://localhost:8080/user/change-password/${userId}`,
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        }
      );

      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Lỗi khi đổi mật khẩu' 
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded">
      <h4>Đổi mật khẩu</h4>
      {message.text && (
        <Alert variant={message.type} className="mt-3">
          {message.text}
        </Alert>
      )}
      <Form onSubmit={handleSubmit} className="mt-4">
        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu hiện tại</Form.Label>
          <Form.Control
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            isInvalid={!!errors.newPassword}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.newPassword}
          </Form.Control.Feedback>
          <Form.Text className="text-muted">
            Mật khẩu phải có ít nhất 6 ký tự và không chứa khoảng trắng
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Xác nhận mật khẩu mới</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            isInvalid={!!errors.confirmPassword}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit">
          Đổi mật khẩu
        </Button>
      </Form>
    </div>
  );
};

export default ChangePasswordTab; 