import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

const ProfileTab = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    birth: '',
    gender: '',
    avatar: ''
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          const response = await fetch(`http://localhost:8080/user/get/${decodedToken.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include'
          });
          const data = await response.json();
          
          if (data.code === 200 && data.result) {
            const formattedData = {
              ...data.result,
              birth: data.result.birth ? data.result.birth.split('T')[0] : ''
            };
            setUserData(formattedData);
            console.log(formattedData);
          } else {
            setMessage({ type: 'danger', content: data.message || 'Error fetching user data' });
          }
        }
      } catch (error) {
        setMessage({ type: 'danger', content: 'Error fetching user data' });
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      if (!/^[a-zA-ZÀ-ỹ\s]*$/.test(value)) {
        setMessage({ type: 'danger', content: 'Họ và tên không được chứa số hoặc ký tự đặc biệt' });
        return;
      }
    }
    
    if (name === 'phone') {
      if (!/^\d+$/.test(value)) {
        setMessage({ type: 'danger', content: 'Số điện thoại không hợp lệ' });
        return;
      }
    }
    
    setMessage({ type: '', content: '' });
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!/^[a-zA-ZÀ-ỹ\s]*$/.test(userData.name)) {
      setMessage({ type: 'danger', content: 'Họ và tên không hợp lệ' });
      return;
    }
    
    if (userData.phone && !/^\d+$/.test(userData.phone)) {
      setMessage({ type: 'danger', content: 'Số điện thoại không hợp lệ' });
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      
      const response = await fetch(`http://localhost:8080/user/edit/${decodedToken.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage({ type: 'success', content: 'Cập nhật thông tin thành công' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'danger', content: 'Cập nhật thất bại' });
      }
    } catch (error) {
      setMessage({ type: 'danger', content: 'Cập nhật thất bại!' });
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const token = localStorage.getItem('authToken');
        const decodedToken = jwtDecode(token);
        
        const response = await fetch(`http://localhost:8080/user/upload/${decodedToken.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: formData,
        });

        const data = await response.json();
        if (data.code === 200 && data.result) {
          setUserData(prev => ({
            ...prev,
            avatar: data.result.avatar
          }));
          setMessage({ type: 'success', content: 'Cập nhật ảnh đại diện thành công' });
        } else {
          setMessage({ type: 'danger', content: data.message || 'Cập nhật ảnh thất bại' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setMessage({ type: 'danger', content: 'Cập nhật ảnh thất bại' });
      }
    }
  };

  const handleClearAvatar = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const decodedToken = jwtDecode(token);
      
      const formData = new FormData();
      
      const response = await fetch(`http://localhost:8080/user/upload/${decodedToken.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (data.code === 200 && data.result) {
        setUserData(prev => ({
          ...prev,
          avatar: data.result.avatar
        }));
        setMessage({ type: 'success', content: 'Đã xóa ảnh đại diện' });
      } else {
        setMessage({ type: 'danger', content: data.message || 'Không thể xóa ảnh đại diện' });
      }
    } catch (error) {
      console.error('Error clearing avatar:', error);
      setMessage({ type: 'danger', content: 'Không thể xóa ảnh đại diện' });
    }
  };

  return (
    <div className="bg-white p-4">
      <h4 className="mb-4">Thông tin cá nhân</h4>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={12} className="mb-4 text-center">
            <div className="position-relative d-inline-block">
              <img
                src={userData.avatar ? `http://localhost:8080/uploads/${userData.avatar}` : 'https://via.placeholder.com/150'}
                alt="Profile"
                className="rounded-circle"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              {isEditing && (
                <div className="position-absolute bottom-0" style={{ right: '-60px' }}>
                  <label htmlFor="avatar-upload" className="btn btn-sm btn-primary rounded-circle me-2">
                    <i className="bi bi-camera"></i>
                  </label>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="rounded-circle"
                    onClick={handleClearAvatar}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                name="birth"
                value={userData.birth}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {message.content && (
          <Alert variant={message.type} className="mt-3">
            {message.content}
          </Alert>
        )}

        <div className="d-flex justify-content-end mt-3">
          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <i className="bi bi-pencil me-2"></i>
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button variant="secondary" className="me-2" onClick={() => setIsEditing(false)}>
                <i className="bi bi-x-circle me-2"></i>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Lưu thay đổi
              </Button>
            </>
          )}
        </div>
      </Form>
    </div>
  );
};

export default ProfileTab; 