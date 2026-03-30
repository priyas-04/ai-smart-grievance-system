import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Building, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Edit
} from 'lucide-react'
import api from '../api.js'
import toast from 'react-hot-toast'

const ComplaintDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: '',
    remarks: ''
  })

  useEffect(() => {
    fetchComplaint()
  }, [id])

  const fetchComplaint = async () => {
    try {
      const response = await api.get(`/api/complaints/${id}`)
      setComplaint(response.data)
      setUpdateData({
        status: response.data.status,
        remarks: response.data.remarks || ''
      })
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to fetch complaint')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const response = await api.put(`/api/complaints/${id}`, updateData)
      setComplaint(response.data)
      setShowUpdateForm(false)
      toast.success('Complaint updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update complaint')
    } finally {
      setUpdating(false)
    }
  }

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'in_progress':
        return <TrendingUp className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const canUpdateComplaint = user?.role === 'officer' || user?.role === 'admin'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Complaint not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      <div className="card p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {complaint.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(complaint.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Complaint ID: #{complaint.id}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(complaint.status)}`}>
                {getStatusIcon(complaint.status)}
                <span className="ml-1">{complaint.status.replace('_', ' ')}</span>
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getPriorityColor(complaint.priority)}`}>
                <AlertTriangle className="h-4 w-4 mr-1" />
                {complaint.priority} priority
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Department</h3>
            <div className="flex items-center text-gray-900">
              <Building className="h-4 w-4 mr-2" />
              {complaint.department_name}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
            <p className="text-gray-900 capitalize">{complaint.category.replace('_', ' ')}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
            <p className="text-gray-900">
              {new Date(complaint.updated_at).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Remarks */}
        {complaint.remarks && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Official Remarks</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{complaint.remarks}</p>
            </div>
          </div>
        )}

        {/* Update Form for Officers/Admin */}
        {canUpdateComplaint && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Complaint</h3>
              {!showUpdateForm && (
                <button
                  onClick={() => setShowUpdateForm(true)}
                  className="btn btn-secondary flex items-center text-sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Status
                </button>
              )}
            </div>

            {showUpdateForm && (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label htmlFor="status" className="label">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="input"
                    value={updateData.status}
                    onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="remarks" className="label">Remarks</label>
                  <textarea
                    id="remarks"
                    name="remarks"
                    rows={3}
                    className="input"
                    placeholder="Add any remarks or updates about this complaint..."
                    value={updateData.remarks}
                    onChange={(e) => setUpdateData({...updateData, remarks: e.target.value})}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn btn-primary"
                  >
                    {updating ? 'Updating...' : 'Update Complaint'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpdateForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ComplaintDetails
