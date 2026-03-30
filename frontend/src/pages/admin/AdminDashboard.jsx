import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Users, 
  Building, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Settings
} from 'lucide-react'
import api from '../../api.js'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, complaintsRes, usersRes, departmentsRes] = await Promise.all([
        api.get('/api/complaints/stats/dashboard'),
        api.get('/api/complaints/'),
        api.get('/api/users/'),
        api.get('/api/departments/')
      ])

      setStats(statsRes.data)
      setComplaints(complaintsRes.data.slice(0, 5))
      setUsers(usersRes.data)
      setDepartments(departmentsRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Users',
      value: users?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      name: 'Total Complaints',
      value: stats?.total_complaints || 0,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      name: 'Departments',
      value: departments?.length || 0,
      icon: Building,
      color: 'bg-purple-500',
      change: '0%'
    },
    {
      name: 'Resolution Rate',
      value: `${stats?.resolution_rate?.toFixed(1) || 0}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Complete overview of the ResolveAI system
        </p>
      </div>

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
                  <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Complaints */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Complaints</h2>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{complaint.title}</p>
                    <p className="text-sm text-gray-600">{complaint.department_name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      complaint.priority === 'high' ? 'bg-red-100 text-red-800' :
                      complaint.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.priority}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No complaints found</p>
            )}
          </div>
        </div>

        {/* Department Overview */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Departments</h2>
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {departments.map((dept) => {
              const deptComplaints = complaints.filter(c => c.department_id === dept.id).length
              return (
                <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{dept.name}</p>
                    <p className="text-sm text-gray-600">{dept.contact_info}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{deptComplaints}</p>
                    <p className="text-xs text-gray-500">complaints</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <PlusCircle className="h-6 w-6 text-blue-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Add User</p>
              <p className="text-sm text-gray-600">Create new user account</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Building className="h-6 w-6 text-green-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Manage Departments</p>
              <p className="text-sm text-gray-600">Configure departments</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Settings className="h-6 w-6 text-purple-600 mr-3" />
            <div className="text-left">
              <p className="font-medium text-gray-900">System Settings</p>
              <p className="text-sm text-gray-600">Configure system</p>
            </div>
          </button>
        </div>
      </div>

      {/* High Priority Alerts */}
      {stats?.high_priority > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <div>
              <p className="font-medium text-red-800">
                {stats.high_priority} High Priority Complaints
              </p>
              <p className="text-sm text-red-600">
                These complaints require immediate attention
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
