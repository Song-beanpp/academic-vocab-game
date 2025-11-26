import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/common/Navbar'

const DailyTasks = () => {
  const navigate = useNavigate()
  const [tasksData, setTasksData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/game/daily-tasks')
        setTasksData(res.data)
      } catch (err) {
        setError('Failed to load daily tasks')
        console.error('Error fetching tasks:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getModuleColor = (module) => {
    const colors = {
      1: 'bg-blue-500',
      2: 'bg-green-500',
      3: 'bg-yellow-500',
      4: 'bg-purple-500'
    }
    return colors[module] || 'bg-gray-500'
  }

  const getModuleIcon = (module) => {
    const icons = {
      1: '📚',
      2: '🔗',
      3: '📝',
      4: '🔄'
    }
    return icons[module] || '📋'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  const tasks = tasksData?.tasks || []
  const completedCount = tasks.filter(t => t.completed).length
  const allCompleted = tasksData?.allCompleted || completedCount >= 4
  const loginStreak = tasksData?.loginStreak || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Streak Display */}
        {loginStreak > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 mb-6 text-white text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">🔥</span>
              <span className="text-xl font-bold">连续学习 {loginStreak} 天</span>
              <span className="text-3xl">🔥</span>
            </div>
          </div>
        )}

        {/* All tasks completed celebration */}
        {allCompleted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold text-green-800">今日任务已完成！</h2>
            <p className="text-green-700 mt-1">太棒了！您已完成今天的全部4个任务。</p>
            <p className="text-green-600 mt-2">明天再来继续学习吧！</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              查看学习进度
            </button>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">今日训练任务</h1>
          <p className="mt-1 text-gray-600">
            {completedCount < 4
              ? `还有 ${4 - completedCount} 个任务待完成`
              : '今日任务已全部完成！明天再来！'
            }
          </p>
          {/* Progress indicator */}
          <div className="flex gap-2 mt-3">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className={`w-8 h-2 rounded ${task.completed ? 'bg-green-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {tasks.map((task, index) => {
            const completed = task.completed
            const disabled = allCompleted && !completed

            return (
              <Link
                key={task.id}
                to={disabled ? '#' : `/task/${task.id}`}
                onClick={(e) => {
                  if (disabled) {
                    e.preventDefault()
                  }
                }}
                className={`rounded-xl shadow-sm p-6 transition block ${
                  completed
                    ? 'bg-green-50 border-2 border-green-200'
                    : disabled
                    ? 'bg-gray-100 cursor-not-allowed opacity-60'
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${completed ? 'bg-green-500' : getModuleColor(task.module)} rounded-lg flex items-center justify-center text-2xl mr-4`}>
                    {completed ? '✓' : getModuleIcon(task.module)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500">任务 {index + 1}</span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded ${completed ? 'bg-green-500' : getModuleColor(task.module)} text-white`}>
                        {completed ? '已完成' : `模块 ${task.module}`}
                      </span>
                    </div>
                    <h3 className={`text-lg font-semibold mt-1 ${completed ? 'text-green-800' : 'text-gray-900'}`}>
                      {task.moduleName}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {task.taskName}
                    </p>
                  </div>
                  <div className={completed ? 'text-green-600' : 'text-primary-600'}>
                    {completed ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {tasks.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无可用任务。</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default DailyTasks
