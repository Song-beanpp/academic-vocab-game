import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import Navbar from '../components/common/Navbar'

// Import game components - Module 1: Vocabulary
import FlashcardGame from '../components/games/vocabulary/FlashcardGame'
import SpellingGame from '../components/games/vocabulary/SpellingGame'
import MeaningMatchGame from '../components/games/vocabulary/MeaningMatchGame'
import WordFamilyGame from '../components/games/vocabulary/WordFamilyGame'
import ContextualUsageGame from '../components/games/vocabulary/ContextualUsageGame'

// Module 2: Collocation
import ErrorDetectionGame from '../components/games/collocation/ErrorDetectionGame'
import ErrorCorrectionGame from '../components/games/collocation/ErrorCorrectionGame'
import ContrastiveGame from '../components/games/collocation/ContrastiveGame'
import GapFillGame from '../components/games/collocation/GapFillGame'

// Module 3: Hedging
import AddHedgingGame from '../components/games/hedging/AddHedgingGame'
import StrengthRankingGame from '../components/games/hedging/StrengthRankingGame'
import AppropriatenessGame from '../components/games/hedging/AppropriatenessGame'

// Module 4: Linking
import LinkingMatchGame from '../components/games/linking/LinkingMatchGame'
import ParagraphReorderGame from '../components/games/linking/ParagraphReorderGame'
import CompletionGame from '../components/games/linking/CompletionGame'

const TaskPage = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [taskData, setTaskData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [startTime] = useState(Date.now())
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const res = await api.get(`/api/game/task/${taskId}`)
        setTaskData(res.data)

        // If task already completed, show message
        if (res.data.completed) {
          setError('该任务已完成')
        }
      } catch (err) {
        setError('加载任务数据失败')
        console.error('Error fetching task data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTaskData()
  }, [taskId])

  const handleTaskComplete = async (correctRate) => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)

    // Ensure correctRate is between 0 and 1
    const clampedRate = Math.max(0, Math.min(1, correctRate))

    try {
      const res = await api.post('/api/game/submit-task', {
        taskId,
        module: taskData.module,
        taskType: taskData.taskType,
        correctRate: clampedRate,
        timeSpent
      })

      // Show completion screen
      setScore(Math.round(clampedRate * 100))
      setCompleted(true)
    } catch (err) {
      console.error('Error submitting task:', err)
      if (err.response?.data?.message === 'Task already completed') {
        setError('该任务已完成')
        setCompleted(true)
        setScore(0)
      } else {
        alert('保存进度失败，请重试。')
      }
    }
  }

  const renderGame = () => {
    if (!taskData) return null

    const { module, taskType, data } = taskData
    const props = {
      data,
      onComplete: handleTaskComplete,
      taskId  // Pass taskId for progress persistence
    }

    // Module 1: Vocabulary
    if (module === 1) {
      switch (taskType) {
        case 'flashcard':
          return <FlashcardGame {...props} />
        case 'spelling':
          return <SpellingGame {...props} />
        case 'meaning_match':
          return <MeaningMatchGame {...props} />
        case 'word_family':
          return <WordFamilyGame {...props} />
        case 'contextual_usage':
          return <ContextualUsageGame {...props} />
        default:
          return <FlashcardGame {...props} />
      }
    }

    // Module 2: Collocation
    if (module === 2) {
      switch (taskType) {
        case 'error_detection':
          return <ErrorDetectionGame {...props} />
        case 'error_correction':
          return <ErrorCorrectionGame {...props} />
        case 'contrastive':
          return <ContrastiveGame {...props} />
        case 'gap_fill':
          return <GapFillGame {...props} />
        default:
          return <ErrorDetectionGame {...props} />
      }
    }

    // Module 3: Hedging
    if (module === 3) {
      switch (taskType) {
        case 'add_hedging':
          return <AddHedgingGame {...props} />
        case 'strength_ranking':
          return <StrengthRankingGame {...props} />
        case 'appropriateness':
          return <AppropriatenessGame {...props} />
        default:
          return <AddHedgingGame {...props} />
      }
    }

    // Module 4: Linking Devices
    if (module === 4) {
      switch (taskType) {
        case 'linking_match':
          return <LinkingMatchGame {...props} />
        case 'paragraph_reorder':
          return <ParagraphReorderGame {...props} />
        case 'completion':
          return <CompletionGame {...props} />
        default:
          return <LinkingMatchGame {...props} />
      }
    }

    return <div className="text-center py-12">未知任务类型</div>
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

  if (error && !completed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/daily-tasks')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            返回任务列表
          </button>
        </div>
      </div>
    )
  }

  // Completion screen
  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-md mx-auto py-12 px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className={`text-6xl mb-4 ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">任务完成！</h2>
            <p className="text-4xl font-bold text-primary-600 mb-4">{score}%</p>
            <p className="text-gray-600 mb-6">
              {score >= 80 ? '太棒了！' : score >= 60 ? '做得不错！' : '继续加油！'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/daily-tasks')}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                继续下一个任务
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                返回仪表板
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Task header */}
        {taskData && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>模块 {taskData.module}</span>
              <span>•</span>
              <span>{taskData.moduleName}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{taskData.taskName}</h1>
          </div>
        )}
        {renderGame()}
      </main>
    </div>
  )
}

export default TaskPage
