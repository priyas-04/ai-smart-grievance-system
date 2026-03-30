import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Building,
  Filter
} from 'lucide-react'
import api from '../../api.js'
import toast from 'react-hot-toast'

const OfficerDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [filter])

  const fetchDashboardData = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const [statsRes, complaintsRes] = await Promise.all([
        api.get('/api/complaints/stats/dashboard'),
        api.get('/api/complaints/', { params })
      ])

      setStats(statsRes.data)
      setComplaints(complaintsRes.data || [])
      console.log('Officer dashboard data:', {
        user: user?.email,
        department_id: user?.department_id,
        complaints: complaintsRes.data?.length || 0
      })
    } catch (error) {
      console.error('Error fetching officer dashboard data:', error)
      toast.error('Failed to load dashboard data')
      // Set default data to prevent white page
      setStats({ total_complaints: 0, pending: 0, in_progress: 0, resolved: 0, high_priority: 0, resolution_rate: 0 })
      setComplaints([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await api.put(`/api/complaints/${complaintId}`, { status: newStatus })
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating complaint:', error)
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
      name: 'Total Complaints',
      value: stats?.total_complaints || 0,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Pending',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      name: 'In Progress',
      value: stats?.in_progress || 0,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      name: 'Resolved',
      value: stats?.resolved || 0,
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-orange-100 text-orange-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Officer Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage complaints for {user?.department_name || `Department ${user?.department_id}` || 'your department'}
        </p>
        <p className="text-sm text-gray-500">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* High Priority Alert */}
      {stats?.high_priority > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="card p-4 mb-6 bg-yellow-50 border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Information</h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>User: {user?.email}</p>
            <p>Role: {user?.role}</p>
            <p>Department ID: {user?.department_id}</p>
            <p>Department Name: {user?.department_name || 'Loading...'}</p>
            <p>Complaints Count: {complaints?.length || 0}</p>
            <p>User Object: {JSON.stringify(user, null, 2)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Department Complaints</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{complaint.title}</p>
                        <p className="text-sm text-gray-500">ID: #{complaint.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 capitalize">
                        {complaint.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {complaint.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(complaint.id, 'in_progress')}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Start Work
                          </button>
                        )}
                        {complaint.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Info */}
      <div className="card p-6">
        <div className="flex items-center mb-4">
          <Building className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Department Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Department Name</p>
            <p className="text-gray-900">{user?.department?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Contact Information</p>
            <p className="text-gray-900">{user?.department?.contact_info}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfficerDashboard
