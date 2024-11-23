import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CAlert,
} from '@coreui/react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const getPositionDisplayName = (positionName) => {
    switch (positionName) {
      case 'CustomerEmployee':
        return 'Nhân viên CSKH';
      case 'Employee':
        return 'Nhân viên';
      case 'Manager':
        return 'Quản lý';
      default:
        return positionName;
    }
  };

  const [userData, setUserData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    birth: '',
    gender: '',
    position: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          navigate('/login')
          return
        }

        const decoded = jwtDecode(token)
        const username = decoded.sub
        
        const response = await fetch(`http://localhost:8080/employee/${username}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.result) {
            setUserData({
              username: data.result.username,
              name: data.result.name || '',
              email: data.result.email || '',
              phone: data.result.phone || '',
              birth: data.result.birth || '',
              gender: data.result.gender || '',
              position: getPositionDisplayName(data.result.position?.name) || ''
            })
          }
        } else if (response.status === 401) {
          localStorage.removeItem('authToken')
          navigate('/login')
        }
      } catch (error) {
        console.error('Error fetching employee data:', error)
        setMessage({ type: 'danger', content: 'Không thể tải thông tin nhân viên' })
      }
    }

    fetchEmployeeData()
  }, [navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'phone') {
      if (value && !/^\d*$/.test(value)) {
        return; // Don't update if input contains non-digits
      }
    }

    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const phoneRegex = /^\d+$/;
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

    if (userData.phone && !phoneRegex.test(userData.phone)) {
      setMessage({ type: 'danger', content: 'Số điện thoại chỉ được chứa số' });
      return;
    }

    if (userData.name && !nameRegex.test(userData.name)) {
      setMessage({ type: 'danger', content: 'Họ và tên không được chứa số hoặc ký tự đặc biệt' });
      return;
    }

    if (userData.gender && !['Nam', 'Nữ'].includes(userData.gender)) {
      setMessage({ type: 'danger', content: 'Giới tính chỉ có thể là Nam hoặc Nữ' });
      return;
    }

    try {
      const token = localStorage.getItem('authToken')
      const decoded = jwtDecode(token)
      
      const response = await fetch(`http://localhost:8080/employee/editusername/${decoded.sub}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          birth: userData.birth,
          gender: userData.gender
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.result) {
          setUserData(prev => ({
            ...prev,
            name: data.result.name || '',
            email: data.result.email || '',
            phone: data.result.phone || '',
            birth: data.result.birth || '',
            gender: data.result.gender || '',
            position: prev.position
          }))
          setMessage({ type: 'success', content: 'Cập nhật thông tin thành công' })
          setIsEditing(false)
        }
      } else {
        setMessage({ type: 'danger', content: 'Cập nhật thất bại' })
      }
    } catch (error) {
      console.error('Error updating employee data:', error)
      setMessage({ type: 'danger', content: 'Đã xảy ra lỗi khi cập nhật' })
    }
  }

  return (
    <CRow>
      <CCol md={12}>
        <CCard>
          <CCardBody>
            <h4 className="mb-4">Thông tin cá nhân</h4>
            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={6}>
                  <div className="mb-3">
                    <label>Tên đăng nhập</label>
                    <CFormInput
                      type="text"
                      name="username"
                      value={userData.username}
                      disabled
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <label>Vị trí</label>
                    <CFormInput
                      type="text"
                      value={userData.position}
                      disabled
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <label>Họ và tên</label>
                    <CFormInput
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <label>Email</label>
                    <CFormInput
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <label>Số điện thoại</label>
                    <CFormInput
                      type="text"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <label>Ngày sinh</label>
                    <CFormInput
                      type="date"
                      name="birth"
                      value={userData.birth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </CCol>
                <CCol md={6}>
                  <div className="mb-3">
                    <label>Giới tính</label>
                    <CFormSelect
                      name="gender"
                      value={userData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>

              {message.content && (
                <CAlert color={message.type} className="mt-3">
                  {message.content}
                </CAlert>
              )}

              <div className="d-flex justify-content-end mt-3">
                {!isEditing ? (
                  <CButton color="primary" onClick={() => setIsEditing(true)}>
                    Chỉnh sửa
                  </CButton>
                ) : (
                  <>
                    <CButton color="secondary" className="me-2" onClick={() => setIsEditing(false)}>
                      Hủy
                    </CButton>
                    <CButton color="primary" type="submit">
                      Lưu thay đổi
                    </CButton>
                  </>
                )}
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProfilePage
