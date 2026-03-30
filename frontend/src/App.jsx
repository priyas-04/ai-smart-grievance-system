import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SubmitComplaint from './pages/SubmitComplaint'
import ComplaintDetails from './pages/ComplaintDetails'
import Profile from './pages/Profile'
import AdminDashboardEnhanced from './pages/admin/AdminDashboardEnhanced'
import OfficerDashboard from './pages/officer/OfficerDashboard'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="submit-complaint" element={<SubmitComplaint />} />
        <Route path="complaint/:id" element={<ComplaintDetails />} />
        <Route path="profile" element={<Profile />} />
        
        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboardEnhanced />} />
        
        {/* Officer Routes */}
        <Route path="officer" element={<OfficerDashboard />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App
