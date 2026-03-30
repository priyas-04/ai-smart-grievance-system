import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import api from '../api.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/users/me')
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { access_token } = response.data
      
      localStorage.setItem('token', access_token)
      
      await fetchUser()
      toast.success('Login successful!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed')
      return false
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData)
      const { access_token } = response.data
      
      localStorage.setItem('token', access_token)
      
      await fetchUser()
      toast.success('Registration successful!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
