import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LayoutDebug = () => {
  const { user, logout } = useAuth()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{color: '#2563eb', fontSize: '1.5rem', fontWeight: 'bold'}}>
            ResolveAI
          </h1>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <span style={{color: '#6b7280'}}>
            Welcome, {user?.name || 'User'}!
          </span>
          <button
            onClick={logout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{padding: '2rem'}}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default LayoutDebug
