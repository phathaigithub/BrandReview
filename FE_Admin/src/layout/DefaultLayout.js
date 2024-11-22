import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const authToken = localStorage.getItem('authToken')
  
  if (!authToken) {
    return <Navigate to="/" replace />
  }

  try {
    const decoded = jwtDecode(authToken)
    if (!decoded.position) {
      return <Navigate to="/" replace />
    }

    return (
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader />
          <div className="body flex-grow-1">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>
    )
  } catch (error) {
    return <Navigate to="/" replace />
  }
}

export default DefaultLayout
