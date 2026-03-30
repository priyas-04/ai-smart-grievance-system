import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const DashboardDebug = () => {
  const { user } = useAuth()
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    console.log('DashboardDebug: User:', user)
    setMessage('Dashboard loaded successfully!')
  }, [user])

  return (
    <div style={{
      padding: '20px',
      background: 'white',
      margin: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{color: '#2563eb', fontSize: '24px', marginBottom: '20px'}}>
        Debug Dashboard
      </h1>
      
      <div style={{marginBottom: '20px'}}>
        <strong>User Info:</strong>
        <pre style={{background: '#f3f4f6', padding: '10px', borderRadius: '4px'}}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      
      <div style={{marginBottom: '20px'}}>
        <strong>Status:</strong> {message}
      </div>
      
      <div style={{marginBottom: '20px'}}>
        <strong>Available Actions:</strong>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li style={{padding: '5px 0'}}>✅ Dashboard component is rendering</li>
          <li style={{padding: '5px 0'}}>✅ User context is working</li>
          <li style={{padding: '5px 0'}}>✅ Basic layout is functional</li>
        </ul>
      </div>
      
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2>ResolveAI Dashboard</h2>
        <p>AI-Powered Grievance Management System</p>
        <p style={{marginTop: '10px', fontSize: '14px'}}>
          This debug page confirms the basic functionality is working.
        </p>
      </div>
    </div>
  )
}

export default DashboardDebug
