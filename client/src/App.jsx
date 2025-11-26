import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DailyTasks from './pages/DailyTasks'
import TaskPage from './pages/TaskPage'
import Progress from './pages/Progress'
import AdminPanel from './pages/AdminPanel'
import StudentDetail from './pages/StudentDetail'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daily-tasks"
              element={
                <ProtectedRoute experimentalOnly>
                  <DailyTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/task/:taskId"
              element={
                <ProtectedRoute experimentalOnly>
                  <TaskPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/student/:id"
              element={
                <ProtectedRoute adminOnly>
                  <StudentDetail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
