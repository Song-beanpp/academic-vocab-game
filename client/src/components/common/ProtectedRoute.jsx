import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false, experimentalOnly = false }) => {
  const { isAuthenticated, isAdmin, isExperimental, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  if (experimentalOnly && !isExperimental) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
