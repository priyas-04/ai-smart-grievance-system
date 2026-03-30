import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Building, Save } from 'lucide-react'
import api from '../api.js'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, fetchUser } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      await api.put('/api/users/me', formData)
      await fetchUser()
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-10 w-10 text-primary-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input pl-10"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">User Role</label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="px-3 py-1 text-xs rounded-full bg-primary-100 text-primary-800 capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>

              <div>
                <label className="label">Department</label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  {user?.department ? (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{user.department.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Access</h3>
            <div className="space-y-3">
              {user?.role === 'citizen' && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-800">Submit Complaints</span>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Allowed
                  </span>
                </div>
              )}
              
              {user?.role === 'officer' && (
                <>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">View Department Complaints</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Allowed
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">Update Complaint Status</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Allowed
                    </span>
                  </div>
                </>
              )}
              
              {user?.role === 'admin' && (
                <>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">View All Complaints</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Allowed
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-green-800">Manage Users</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Allowed
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-red-800">Submit Complaints</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Not Allowed
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="btn btn-primary flex items-center"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
