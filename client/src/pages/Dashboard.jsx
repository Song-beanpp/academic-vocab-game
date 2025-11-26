import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user, isExperimental } = useAuth()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get('/api/game/progress')
        setProgress(res.data)
      } catch (error) {
        console.error('Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [])

  const moduleChartData = progress ? [
    { name: 'Vocabulary', minutes: progress.moduleBreakdown.module1, fill: '#3B82F6' },
    { name: 'Collocation', minutes: progress.moduleBreakdown.module2, fill: '#10B981' },
    { name: 'Hedging', minutes: progress.moduleBreakdown.module3, fill: '#F59E0B' },
    { name: 'Linking', minutes: progress.moduleBreakdown.module4, fill: '#8B5CF6' }
  ] : []

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section with Streak */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.name}!
              </h1>
              <div className="mt-2 flex items-center gap-4">
                {progress?.loginStreak > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                    <span className="text-2xl">🔥</span>
                    <span className="font-semibold">连续学习 {progress.loginStreak} 天</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                  <span className="text-lg">📅</span>
                  <span>今日任务：{progress?.todayCompleted || 0}/{progress?.todayTotal || 4}</span>
                </div>
              </div>
            </div>
            {isExperimental && (
              <Link
                to="/daily-tasks"
                className="px-6 py-3 bg-white text-primary-600 rounded-lg shadow-md hover:bg-gray-50 hover:shadow-lg transition font-medium"
              >
                {progress?.todayCompleted >= 4 ? '查看今日任务' : '开始今日训练'}
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">总学习时长</p>
            <p className="text-3xl font-bold text-gray-900">{progress?.totalTime || 0}</p>
            <p className="text-sm text-gray-500">分钟</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">登录天数</p>
            <p className="text-3xl font-bold text-primary-600">{progress?.loginFrequency || 0}</p>
            <p className="text-sm text-gray-500">天</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">连续学习</p>
            <p className="text-3xl font-bold text-orange-500">{progress?.loginStreak || 0}</p>
            <p className="text-sm text-gray-500">天</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">完成任务</p>
            <p className="text-3xl font-bold text-gray-900">{progress?.completedTasksCount || 0}</p>
            <p className="text-sm text-gray-500">个</p>
          </div>
        </div>

        {/* Charts Row */}
        {isExperimental && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Module Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">模块练习分布</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: '分钟', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="minutes" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">最近7天学习趋势</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progress?.weeklyStats || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis label={{ value: '分钟', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="timeSpent"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Module Stats */}
        {isExperimental && progress?.moduleStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map(num => {
              const stat = progress.moduleStats[`module${num}`]
              const names = ['词汇训练', '搭配训练', '限制语练习', '连接词训练']
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']

              return (
                <div key={num} className="bg-white rounded-xl shadow-sm p-4">
                  <div className={`w-3 h-3 rounded-full ${colors[num-1]} mb-2`}></div>
                  <h3 className="font-medium text-gray-900">{names[num-1]}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      时长：<span className="font-medium text-gray-900">{stat?.time || 0} 分钟</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      任务：<span className="font-medium text-gray-900">{stat?.taskCount || 0} 个</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      正确率：<span className="font-medium text-gray-900">{stat?.avgCorrectRate || 0}%</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Recent Activity */}
        {progress?.recentTasks && progress.recentTasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h2>
            <div className="space-y-3">
              {progress.recentTasks.slice(0, 5).map((task, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      模块 {task.module} - {task.taskType.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(task.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${task.correctRate >= 0.8 ? 'text-green-600' : task.correctRate >= 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Math.round(task.correctRate * 100)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {Math.round(task.timeSpent / 60)} 分钟
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Group Message */}
        {!isExperimental && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
            <h3 className="font-semibold text-blue-800">对照组</h3>
            <p className="mt-2 text-blue-700">
              作为对照组成员，您可以在这里查看您的测试成绩和进度。
              游戏模块仅对实验组开放。
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
