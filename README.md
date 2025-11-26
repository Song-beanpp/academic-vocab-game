# Academic Vocabulary Game

A gamified academic vocabulary training system for Chinese EFL learners, featuring 4 game modules that train vocabulary, collocations, hedging, and linking devices. Designed for research purposes with comprehensive data tracking for MANOVA and Path Analysis.

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Recharts (data visualization)
- react-beautiful-dnd (drag & drop)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- json2csv (data export)

### Deployment
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas

## Features

### For Students
- **4 Game Modules**:
  - Module 1: Vocabulary Training (flashcards, spelling, meaning match, word families)
  - Module 2: Collocation Training (error detection, correction, comparison, fill-blank)
  - Module 3: Hedging Practice (add hedging, intensity ordering, appropriateness)
  - Module 4: Linking Devices (connector matching, paragraph reordering, completion)
- Personal dashboard with progress charts
- Smart task recommendation based on pre-test scores
- Learning streak tracking

### For Researchers/Admins
- Student management panel
- Test score input (pre/post/delayed)
- CSV data export for SPSS analysis
- Comprehensive learning analytics

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd academic-vocab-game
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Server (.env):
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/academic-vocab-game
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
NODE_ENV=development
```

5. **Start MongoDB** (if running locally)
```bash
mongod
```

6. **Start the development servers**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Creating Admin User

After starting the server, create an admin user:
```bash
curl -X POST http://localhost:5000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "admin001",
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Game
- `GET /api/game/daily-tasks` - Get today's recommended tasks
- `GET /api/game/module-data/:id` - Get module training data
- `POST /api/game/submit-task` - Submit task completion
- `GET /api/game/progress` - Get learning progress

### Test Scores
- `POST /api/test/submit` - Submit test scores (admin)
- `GET /api/test/scores/:userId` - Get user's test scores
- `GET /api/test/my-scores` - Get current user's scores

### Admin
- `GET /api/admin/students` - List all students
- `GET /api/admin/student/:id` - Get student details
- `GET /api/admin/export-csv` - Export research data

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Set build settings:
   - Framework: Vite
   - Root Directory: client
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your Railway backend URL

### Backend (Railway)

1. Create new project in Railway
2. Add MongoDB plugin or connect to Atlas
3. Deploy from GitHub:
   - Root Directory: server
4. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret key
   - `JWT_EXPIRE`: 30d
   - `NODE_ENV`: production

### MongoDB Atlas

1. Create free cluster at mongodb.com
2. Create database user
3. Whitelist all IPs (0.0.0.0/0) or Railway IPs
4. Get connection string and update Railway env

## Project Structure

```
academic-vocab-game/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── games/     # 4 game modules
│   │   │   │   ├── vocabulary/
│   │   │   │   ├── collocation/
│   │   │   │   ├── hedging/
│   │   │   │   └── linking/
│   │   │   └── admin/
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── utils/
│   └── package.json
├── server/                 # Backend Express app
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── utils/         # Utilities
│   ├── data/              # JSON training data
│   └── package.json
└── README.md
```

## Data Models

### User
- studentId, name, email, password
- group: experimental/control
- role: student/admin

### GameProgress
- totalTime, loginFrequency, streak
- moduleBreakdown: {module1, module2, module3, module4}
- taskHistory: [{date, module, taskType, correctRate, timeSpent}]
- completedTasks: []

### TestScore
- userId, testType: pre/post/delayed
- scores: {vocabulary, collocation, frequency, diversity, complexity, hedging, coherence}

## CSV Export Format

The exported CSV includes:
```
student_id, group, total_time, login_freq, m1_time, m2_time, m3_time, m4_time,
pre_vocab, pre_coll, pre_freq, pre_div, pre_comp, pre_hedg, pre_cohe,
post_vocab, post_coll, post_freq, post_div, post_comp, post_hedg, post_cohe,
delayed_vocab, delayed_coll, delayed_freq, delayed_div, delayed_comp, delayed_hedg, delayed_cohe
```

## Research Variables

### Independent Variables (Process)
- total_time: Total learning time (minutes)
- login_freq: Number of login days
- m1_time - m4_time: Time per module

### Dependent Variables (Outcome)
- vocabulary: Vocabulary test score (0-100)
- collocation: Collocation test score (0-100)
- frequency: AWL usage frequency
- diversity: TTR diversity score
- complexity: Advanced vocabulary coverage
- hedging: Hedging appropriateness (1-5)
- coherence: Coherence score (1-5)

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
