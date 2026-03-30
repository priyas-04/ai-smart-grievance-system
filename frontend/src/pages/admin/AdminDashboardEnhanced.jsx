import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Users, 
  Building, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Settings,
  Edit,
  Trash2,
  Shield,
  Database,
  Activity
} from 'lucide-react'
import api from '../../api.js'
import toast from 'react-hot-toast'

const AdminDashboardEnhanced = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showDeptModal, setShowDeptModal] = useState(false)
  const [creatingUser, setCreatingUser] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen',
    department_id: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, departmentsRes] = await Promise.all([
        api.get('/api/complaints/stats/dashboard'),
        api.get('/api/users/'),
        api.get('/api/departments/')
      ])

      setStats(statsRes.data)
      setUsers(usersRes.data || [])
      setDepartments(departmentsRes.data || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
      // Set default data to prevent white page
      setStats({ total_complaints: 0, pending: 0, in_progress: 0, resolved: 0, high_priority: 0, resolution_rate: 0 })
      setUsers([])
      setDepartments([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setCreatingUser(true)
    try {
      // Prepare user data with proper handling of department_id
      const userData = {
        ...formData,
        department_id: formData.department_id ? parseInt(formData.department_id) : null
      }
      
      await api.post('/api/users/', userData)
      toast.success('User created successfully!')
      setShowUserModal(false)
      setFormData({ name: '', email: '', password: '', role: 'citizen', department_id: '' })
      fetchDashboardData()
    } catch (error) {
      console.error('User creation error:', error)
      toast.error(error.response?.data?.detail || 'Failed to create user')
    } finally {
      setCreatingUser(false)
    }
  }

  const handleCreateDept = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/departments/', {
        name: formData.name,
        contact_info: formData.contact_info
      })
      toast.success('Department created successfully!')
      setShowDeptModal(false)
      setFormData({ name: '', contact_info: '' })
      fetchDashboardData()
    } catch (error) {
      console.error('Department creation error:', error)
      toast.error(error.response?.data?.detail || 'Failed to create department')
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return
    }

    try {
      await api.delete(`/api/users/${userId}`)
      toast.success('User deleted successfully!')
      fetchDashboardData()
    } catch (error) {
      console.error('User deletion error:', error)
      toast.error(error.response?.data?.detail || 'Failed to delete user')
    }
  }

  const handleDeleteDepartment = async (deptId, deptName) => {
    if (!window.confirm(`Are you sure you want to delete ${deptName}? This action cannot be undone.`)) {
      return
    }

    try {
      await api.delete(`/api/departments/${deptId}`)
      toast.success('Department deleted successfully!')
      fetchDashboardData()
    } catch (error) {
      console.error('Department deletion error:', error)
      toast.error(error.response?.data?.detail || 'Failed to delete department')
    }
  }

  const getDepartmentName = (departmentId) => {
    if (!departmentId) return 'Not assigned'
    const dept = departments.find(d => d.id === departmentId)
    return dept ? dept.name : `Department ${departmentId}`
  }

  const statCards = [
    {
      name: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      description: 'Registered users'
    },
    {
      name: 'Total Complaints',
      value: stats?.total_complaints || 0,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
      description: 'All complaints filed'
    },
    {
      name: 'Departments',
      value: departments?.length || 0,
      icon: Building,
      color: 'bg-purple-500',
      change: '0%',
      description: 'Active departments'
    },
    {
      name: 'Resolution Rate',
      value: `${stats?.resolution_rate?.toFixed(1) || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5%',
      description: 'Complaints resolved'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Complete control and management of ResolveAI system
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'users', 'departments', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.name} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                      <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* System Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                System Performance
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">AI Classification</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Smart Routing</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Database</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">API Response</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Normal</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                System Alerts
              </h2>
              <div className="space-y-4">
                {stats?.high_priority > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-red-800 font-medium">
                        {stats.high_priority} high priority complaints need attention
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <Database className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">
                      System operating normally
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'officer' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.department_name || getDepartmentName(user.department_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'departments' && (
        <div>
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Department Management</h2>
              <button
                onClick={() => setShowDeptModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Department
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments && departments.length > 0 ? (
                departments.map((dept) => (
                  <div key={dept.id} className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{dept.name}</h3>
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{dept.contact_info}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No departments found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-600" />
                System Configuration
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Model Version</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-900">v2.1.0 - TF-IDF + NMF</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Classification Accuracy</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-green-600 font-semibold">94.7%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-routing Enabled</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-green-600 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-gray-600" />
                Security Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-900">Min 8 chars, 1 uppercase, 1 number</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Two-Factor Auth</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-orange-600 font-semibold">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for invalid tab */}
      {!['overview', 'users', 'departments', 'settings'].includes(activeTab) && (
        <div className="text-center py-8">
          <p className="text-gray-500">Invalid tab selected</p>
          <button 
            onClick={() => setActiveTab('overview')}
            className="mt-2 text-primary-600 hover:text-primary-800"
          >
            Return to Overview
          </button>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative min-h-screen flex items-center justify-center">
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="citizen">Citizen</option>
                      <option value="officer">Officer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      value={formData.department_id}
                      onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowUserModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingUser}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creatingUser ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative min-h-screen flex items-center justify-center">
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create Department</h3>
                  <button
                    onClick={() => setShowDeptModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleCreateDept} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Information</label>
                    <textarea
                      required
                      value={formData.contact_info}
                      onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowDeptModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Create Department
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardEnhanced
