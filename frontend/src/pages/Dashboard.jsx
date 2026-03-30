import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  PlusCircle,
  TrendingUp
} from 'lucide-react'
import api from '../api.js'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/complaints/stats/dashboard')
      setStats(response.data)
      setError(null)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError(error.message || 'Failed to load dashboard data')
      // Set default stats when API fails
      setStats({
        total_complaints: 0,
        pending: 0,
        in_progress: 0,
        resolved: 0,
        high_priority: 0,
        resolution_rate: 0
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', background: 'white', margin: '20px', borderRadius: '8px'}}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" style={{width: '48px', height: '48px', border: '4px solid #f3f4f6', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
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
    },
    {
      name: 'High Priority',
      value: stats?.high_priority || 0,
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="animate-fade-in" style={{padding: '20px', background: '#f9fafb', minHeight: '100vh'}}>
      {error && (
        <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" style={{marginBottom: '20px', padding: '16px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b'}}>
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <p style={{fontSize: '12px', marginTop: '8px'}}>Showing default data - some features may not work properly.</p>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900" style={{fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px'}}>
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="mt-2 text-gray-600" style={{fontSize: '14px', color: '#6b7280'}}>
          Here's what's happening with your grievances today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card p-6" style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
              <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`} style={{padding: '12px', borderRadius: '8px', background: stat.color === 'bg-blue-500' ? '#dbeafe' : stat.color === 'bg-green-500' ? '#d1fae5' : stat.color === 'bg-yellow-500' ? '#fef3c7' : stat.color === 'bg-red-500' ? '#fee2e2' : '#ede9fe'}}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} style={{width: '24px', height: '24px', color: stat.color === 'bg-blue-500' ? '#2563eb' : stat.color === 'bg-green-500' ? '#059669' : stat.color === 'bg-yellow-500' ? '#d97706' : stat.color === 'bg-red-500' ? '#dc2626' : '#7c3aed'}} />
                </div>
                <div className="ml-4" style={{marginLeft: '16px'}}>
                  <p className="text-sm font-medium text-gray-600" style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900" style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px'}}>
        <div className="card p-6" style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>Quick Actions</h2>
          <div className="space-y-3" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {user?.role === 'citizen' && (
              <Link
                to="/submit-complaint"
                className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                style={{display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', textDecoration: 'none', color: 'inherit'}}
              >
                <PlusCircle className="h-6 w-6 text-primary-600 mr-3" style={{width: '24px', height: '24px', color: '#2563eb', marginRight: '12px'}} />
                <div>
                  <p className="font-medium text-gray-900" style={{fontWeight: '500', color: '#1f2937', margin: '0'}}>Submit New Complaint</p>
                  <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0'}}>File a new grievance</p>
                </div>
              </Link>
            )}
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg" style={{display: 'flex', alignItems: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px'}}>
              <TrendingUp className="h-6 w-6 text-gray-600 mr-3" style={{width: '24px', height: '24px', color: '#6b7280', marginRight: '12px'}} />
              <div>
                <p className="font-medium text-gray-900" style={{fontWeight: '500', color: '#1f2937', margin: '0'}}>Resolution Rate</p>
                <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0'}}>
                  {stats?.resolution_rate ? `${stats.resolution_rate.toFixed(1)}%` : '0%'} of complaints resolved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="card p-6" style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4" style={{fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px'}}>Getting Started</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
          <div style={{padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center'}}>
            <div style={{fontSize: '24px', marginBottom: '8px'}}>📝</div>
            <h3 style={{fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px'}}>Submit Complaint</h3>
            <p style={{fontSize: '12px', color: '#6b7280'}}>File a new grievance</p>
          </div>
          <div style={{padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center'}}>
            <div style={{fontSize: '24px', marginBottom: '8px'}}>📊</div>
            <h3 style={{fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px'}}>Track Progress</h3>
            <p style={{fontSize: '12px', color: '#6b7280'}}>Monitor status</p>
          </div>
          <div style={{padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'center'}}>
            <div style={{fontSize: '24px', marginBottom: '8px'}}>🤖</div>
            <h3 style={{fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px'}}>AI Processing</h3>
            <p style={{fontSize: '12px', color: '#6b7280'}}>Smart routing</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
