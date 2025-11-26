import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Navbar from '../components/common/Navbar'

const StudentDetail = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showScoreForm, setShowScoreForm] = useState(false)
  const [scoreForm, setScoreForm] = useState({
    testType: 'pre',
    vocabulary: '',
    collocation: '',
    frequency: '',
    diversity: '',
    complexity: '',
    hedging: '',
    coherence: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/admin/student/${id}`)
        setData(res.data)
      } catch (error) {
        console.error('Error fetching student:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleScoreSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/test/submit', {
        studentId: data.student.studentId,
        testType: scoreForm.testType,
        scores: {
          vocabulary: parseFloat(scoreForm.vocabulary) || 0,
          collocation: parseFloat(scoreForm.collocation) || 0,
          frequency: parseFloat(scoreForm.frequency) || 0,
          diversity: parseFloat(scoreForm.diversity) || 0,
          complexity: parseFloat(scoreForm.complexity) || 0,
          hedging: parseFloat(scoreForm.hedging) || 0,
          coherence: parseFloat(scoreForm.coherence) || 0
        }
      })
      alert('Score submitted successfully')
      setShowScoreForm(false)
      // Refresh data
      const res = await axios.get(`/api/admin/student/${id}`)
      setData(res.data)
    } catch (error) {
      console.error('Error submitting score:', error)
      alert('Error submitting score')
    }
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

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <p className="text-gray-500">Student not found</p>
        </div>
      </div>
    )
  }

  const { student, progress, testScores } = data

  const moduleChartData = [
    { name: 'Vocab', minutes: progress.moduleBreakdown?.module1 || 0 },
    { name: 'Colloc', minutes: progress.moduleBreakdown?.module2 || 0 },
    { name: 'Hedge', minutes: progress.moduleBreakdown?.module3 || 0 },
    { name: 'Link', minutes: progress.moduleBreakdown?.module4 || 0 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/admin" className="text-primary-600 hover:text-primary-800 text-sm">
            &larr; Back to Admin Panel
          </Link>
        </div>

        {/* Student Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-500">Student ID: {student.studentId}</p>
              <p className="text-gray-500">{student.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 text-sm rounded ${
                student.group === 'experimental' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {student.group} group
              </span>
            </div>
            <button
              onClick={() => setShowScoreForm(!showScoreForm)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Add Test Score
            </button>
          </div>
        </div>

        {/* Score Form Modal */}
        {showScoreForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Test Score</h2>
            <form onSubmit={handleScoreSubmit}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="col-span-2 md:col-span-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                  <select
                    value={scoreForm.testType}
                    onChange={(e) => setScoreForm({...scoreForm, testType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pre">Pre-test</option>
                    <option value="post">Post-test</option>
                    <option value="delayed">Delayed test</option>
                  </select>
                </div>
                {['vocabulary', 'collocation', 'frequency', 'diversity', 'complexity', 'hedging', 'coherence'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={scoreForm[field]}
                      onChange={(e) => setScoreForm({...scoreForm, [field]: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowScoreForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Time</p>
            <p className="text-2xl font-bold text-gray-900">{progress.totalTime} min</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Login Days</p>
            <p className="text-2xl font-bold text-gray-900">{progress.loginFrequency}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="text-2xl font-bold text-primary-600">{progress.streak}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Tasks Done</p>
            <p className="text-2xl font-bold text-gray-900">{progress.completedTasksCount}</p>
          </div>
        </div>

        {/* Module Breakdown Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Module Time Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Test Scores */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Scores</h2>
          {(testScores.pre || testScores.post || testScores.delayed) ? (
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
                      {testScores.pre && <td className="text-center py-2 px-3">{testScores.pre[dim] ?? '-'}</td>}
                      {testScores.post && <td className="text-center py-2 px-3">{testScores.post[dim] ?? '-'}</td>}
                      {testScores.delayed && <td className="text-center py-2 px-3">{testScores.delayed[dim] ?? '-'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No test scores recorded yet</p>
          )}
        </div>

        {/* Task History */}
        {progress.taskHistory && progress.taskHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {progress.taskHistory.slice(-20).reverse().map((task, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Module {task.module} - {task.taskType.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(task.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      task.correctRate >= 0.8 ? 'text-green-600' : task.correctRate >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round(task.correctRate * 100)}%
                    </p>
                    <p className="text-xs text-gray-500">{Math.round(task.timeSpent / 60)} min</p>
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

export default StudentDetail
