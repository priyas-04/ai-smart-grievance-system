import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Send, FileText, AlertCircle } from 'lucide-react'
import api from '../api.js'
import toast from 'react-hot-toast'

const SubmitComplaint = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)

    try {
      const response = await api.post('/api/complaints/', formData)
      toast.success('Complaint submitted successfully! AI has routed it to the appropriate department.')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit complaint')
    } finally {
      setSubmitting(false)
    }
  }

  const sampleComplaints = [
    {
      title: "Water Pipe Burst",
      description: "There is a major water pipe burst on Main Street causing flooding in the area. The water is gushing out and creating hazardous conditions for pedestrians and vehicles."
    },
    {
      title: "Power Outage",
      description: "Our entire neighborhood has been without electricity for the past 6 hours. This is affecting daily life and work from home arrangements."
    },
    {
      title: "Pothole on Highway",
      description: "There is a large and dangerous pothole on the main highway that is causing accidents. It needs immediate attention before someone gets seriously hurt."
    },
    {
      title: "Garbage Collection",
      description: "Garbage has not been collected in our area for over two weeks. This is creating unhygienic conditions and attracting pests."
    }
  ]

  const fillSampleComplaint = (complaint) => {
    setFormData({
      title: complaint.title,
      description: complaint.description
    })
  }

  if (user?.role !== 'citizen') {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 mt-2">
          Only citizens can submit complaints. Your role is {user?.role}.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submit New Complaint</h1>
        <p className="mt-2 text-gray-600">
          Our AI system will automatically route your complaint to the appropriate department.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="label">
                  Complaint Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="input"
                  placeholder="Brief title of your complaint"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={8}
                  required
                  className="input"
                  placeholder="Please provide a detailed description of your complaint. Include location, time, and any other relevant details."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">AI-Powered Routing</p>
                    <p>
                      Your complaint will be automatically analyzed and routed to the correct department 
                      using our AI classification system. High-priority issues will be flagged for immediate attention.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sample Complaints */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Sample Complaints</h3>
            <p className="text-sm text-gray-600 mb-4">
              Click on any example to fill the form:
            </p>
            <div className="space-y-2">
              {sampleComplaints.map((complaint, index) => (
                <button
                  key={index}
                  onClick={() => fillSampleComplaint(complaint)}
                  className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-medium text-sm text-gray-900">{complaint.title}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {complaint.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Tips for Effective Complaints</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Be specific and detailed in your description
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Include exact location and timing
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Mention any safety hazards or urgent concerns
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Provide contact information if follow-up is needed
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                Attach photos if available (coming soon)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmitComplaint
