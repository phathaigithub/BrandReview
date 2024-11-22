import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilHouse,
  cilPeople
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { jwtDecode } from 'jwt-decode'

const _nav = () => {
  const token = localStorage.getItem('authToken')
  let position = 'Employee'
  
  if (token) {
    try {
      const decoded = jwtDecode(token)
      position = decoded.position
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }

  return [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      badge: {
        color: 'info',
        text: 'NEW',
      },
    },
    {
      component: CNavTitle,
      name: 'Danh sách',
    },
    ...(position === 'Manager' ? [{
      component: CNavItem,
      name: 'Nhân viên',
      to: '/list/employeeslist',
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    }] : []),
    {
      component: CNavItem,
      name: 'Người dùng',
      to: '/list/userslist',
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Cửa hàng',
      to: '/list/brandslist',
      icon: <CIcon icon={cilHouse} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Yêu cầu khách hàng',
      to: '/list/contactlist',
      icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    },
  ]
}

export default function getNav() {
  return _nav()
}
