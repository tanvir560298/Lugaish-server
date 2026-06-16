# 🚀 Lugaish Backend Setup

Complete Node.js/Express backend for the language learning platform.

## 📋 Requirements

- Node.js 16+
- MongoDB 4.4+
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the `backend` folder:

```
MONGODB_URI=mongodb://localhost:27017/lugaish
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
CORS_ORIGIN=http://localhost:4174
```

### 3. Start MongoDB

```bash
# On macOS with brew
brew services start mongodb-community

# Or use MongoDB Atlas
# Update MONGODB_URI in .env with your connection string
```

### 4. Seed Database with Sample Lessons

```bash
cd backend
node seed.js
```

Output:
```
✅ English lessons seeded
✅ Arabic lessons seeded
✅ Database seeding completed
```

### 5. Start Backend Server

```bash
cd backend
npm run dev
```

Output:
```
🚀 Backend running on http://localhost:5000
✅ MongoDB connected
```

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/signup       - Create new account
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user (requires token)
```

### Courses

```
GET    /api/courses           - Get all courses
GET    /api/courses/:language - Get course by language
```

### Lessons

```
GET    /api/lessons/:language/:day           - Get lesson details
GET    /api/lessons/today/:language          - Get today's lesson
POST   /api/lessons/complete                 - Mark lesson as complete
```

### Progress

```
GET    /api/progress/:language               - Get user progress
POST   /api/progress/update                  - Update progress
```

### Quiz

```
POST   /api/quiz/submit                      - Submit quiz answers
```

## 🔐 Authentication

All endpoints (except auth and courses) require Bearer token:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📊 Database Models

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  languageSelected: String ('english' or 'arabic'),
  currentDay: Number,
  streak: Number,
  totalXP: Number,
  isPremium: Boolean,
  completedLessons: [Number],
  badges: [String],
  lastActiveDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Lesson

```javascript
{
  day: Number,
  language: String,
  title: String,
  description: String,
  videoUrl: String,
  duration: Number,
  vocabulary: [{word, translation, pronunciation, example}],
  grammar: {concept, explanation, examples},
  speakingTasks: [{prompt, hint}],
  quiz: [{question, options, correctAnswer, explanation}],
  createdAt: Date,
  updatedAt: Date
}
```

### Progress

```javascript
{
  userId: ObjectId,
  language: String,
  completedDays: [{day, completedAt, score}],
  totalXP: Number,
  streak: Number,
  lastActiveDate: Date,
  weakAreas: [String],
  achievements: [{name, unlockedAt}],
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing with curl

### Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Ahmed",
    "email":"ahmed@example.com",
    "password":"password123",
    "languageSelected":"english"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"ahmed@example.com",
    "password":"password123"
  }'
```

### Get Courses

```bash
curl http://localhost:5000/api/courses
```

### Get Today's Lesson

```bash
curl -X GET http://localhost:5000/api/lessons/today/english \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚨 Common Issues

### MongoDB Connection Error

```
❌ MongoDB error: connect ECONNREFUSED
```

**Solution:**
1. Make sure MongoDB is running: `brew services start mongodb-community`
2. Check connection string in `.env`
3. Try MongoDB Atlas (cloud): `mongodb+srv://username:password@cluster.mongodb.net/lugaish`

### Port Already in Use

```
❌ Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Change PORT in `.env` or kill the process using port 5000

### CORS Errors

Update `CORS_ORIGIN` in `.env` to match your frontend URL.

## 📚 Next Steps

1. Connect frontend to backend APIs in React components
2. Add payment integration (Stripe/BKash)
3. Implement email verification
4. Add admin dashboard for content management
5. Deploy to production (Heroku, Railway, Render)

## 🔗 Frontend Integration

Frontend makes API calls to `http://localhost:5000/api/*`

Example in React:

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/lessons/today/english', {
  headers: { Authorization: `Bearer ${token}` }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

**Need help?** Check logs or restart both backend and MongoDB
