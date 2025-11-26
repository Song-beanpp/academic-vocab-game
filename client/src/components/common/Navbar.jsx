import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const { user, logout, isAdmin, isExperimental } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-primary-800">
              Academic Vocab
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Dashboard
              </Link>
              {isExperimental && (
                <Link
                  to="/daily-tasks"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Daily Tasks
                </Link>
              )}
              <Link
                to="/progress"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Progress
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4">
              {user?.name}
              {user?.group && (
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  user.group === 'experimental' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.group}
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
