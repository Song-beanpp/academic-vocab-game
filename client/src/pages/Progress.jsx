import { useState, useEffect } from 'react'
import api from '../utils/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../contexts/AuthContext'

const Progress = () => {
  const { user } = useAuth()
  const [progress, setProgress] = useState(null)
  const [testScores, setTestScores] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, scoresRes] = await Promise.all([
          api.get('/api/game/progress'),
          api.get('/api/test/my-scores')
        ])
        setProgress(progressRes.data)
        setTestScores(scoresRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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

  const moduleChartData = progress ? [
    { name: 'Vocab', minutes: progress.moduleBreakdown?.module1 || 0, accuracy: progress.moduleStats?.module1?.avgCorrectRate || 0 },
    { name: 'Colloc', minutes: progress.moduleBreakdown?.module2 || 0, accuracy: progress.moduleStats?.module2?.avgCorrectRate || 0 },
    { name: 'Hedge', minutes: progress.moduleBreakdown?.module3 || 0, accuracy: progress.moduleStats?.module3?.avgCorrectRate || 0 },
    { name: 'Link', minutes: progress.moduleBreakdown?.module4 || 0, accuracy: progress.moduleStats?.module4?.avgCorrectRate || 0 }
  ] : []

  // Prepare test scores comparison
  const testComparisonData = []
  if (testScores) {
    const dimensions = ['vocabulary', 'collocation', 'hedging', 'coherence']
    dimensions.forEach(dim => {
      const data = { name: dim.charAt(0).toUpperCase() + dim.slice(1) }
      if (testScores.pre?.scores?.[dim]) data.pre = testScores.pre.scores[dim]
      if (testScores.post?.scores?.[dim]) data.post = testScores.post.scores[dim]
      if (testScores.delayed?.scores?.[dim]) data.delayed = testScores.delayed.scores[dim]
      if (Object.keys(data).length > 1) testComparisonData.push(data)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Learning Progress</h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Time</p>
            <p className="text-2xl font-bold text-gray-900">{progress?.totalTime || 0} min</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Days Active</p>
            <p className="text-2xl font-bold text-gray-900">{progress?.loginFrequency || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="text-2xl font-bold text-primary-600">{progress?.streak || 0} days</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Tasks Done</p>
            <p className="text-2xl font-bold text-gray-900">{progress?.completedTasksCount || 0}</p>
          </div>
        </div>

        {/* Module Progress Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Time per Module</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#3B82F6" name="Minutes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Accuracy per Module</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#10B981" name="Accuracy %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Test Scores Comparison */}
        {testComparisonData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Score Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {testScores?.pre && <Bar dataKey="pre" fill="#94A3B8" name="Pre-test" />}
                  {testScores?.post && <Bar dataKey="post" fill="#3B82F6" name="Post-test" />}
                  {testScores?.delayed && <Bar dataKey="delayed" fill="#10B981" name="Delayed" />}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Test Scores Table */}
        {testScores && (testScores.pre || testScores.post || testScores.delayed) && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Scores Detail</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Dimension</th>
                    {testScores.pre && <th className="text-center py-2 px-3">Pre-test</th>}
                    {testScores.post && <th className="text-center py-2 px-3">Post-test</th>}
                    {testScores.delayed && <th className="text-center py-2 px-3">Delayed</th>}
                  </tr>
                </thead>
                <tbody>
                  {['vocabulary', 'collocation', 'frequency', 'diversity', 'complexity', 'hedging', 'coherence'].map(dim => (
                    <tr key={dim} className="border-b">
                      <td className="py-2 px-3 capitalize">{dim}</td>
                      {testScores.pre && (
                        <td className="text-center py-2 px-3">
                          {testScores.pre.scores?.[dim] ?? '-'}
                        </td>
                      )}
                      {testScores.post && (
                        <td className="text-center py-2 px-3">
                          {testScores.post.scores?.[dim] ?? '-'}
                        </td>
                      )}
                      {testScores.delayed && (
                        <td className="text-center py-2 px-3">
                          {testScores.delayed.scores?.[dim] ?? '-'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {progress?.recentTasks && progress.recentTasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {progress.recentTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      Module {task.module} - {task.taskType.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(task.date).toLocaleDateString()} at {new Date(task.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${task.correctRate >= 0.8 ? 'text-green-600' : task.correctRate >= 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Math.round(task.correctRate * 100)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      {Math.round(task.timeSpent / 60)} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Progress
