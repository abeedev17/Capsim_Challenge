# Capsim Quiz Assessment

A full-stack quiz application built with Vue.js 3, Node.js, and MySQL, featuring quiz assessment and score distribution visualization.

## Features

- Interactive quiz interface with single and multiple choice questions
- Real-time score calculation
- Score distribution visualization using bar charts
- RESTful API backend
- Automated tests for both frontend and backend

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm (Node Package Manager)

## Project Structure

```
capsim-quiz/
├── frontend/          # Vue.js frontend application
├── backend/           # Node.js backend application
└── README.md
```

## Setup Instructions

### Database Setup

1. Create MySQL databases for development and testing:

```sql
CREATE DATABASE capsim_quiz;
CREATE DATABASE capsim_quiz_test;
```

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```env
PORT=3000
DB_NAME=capsim_quiz
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
```

4. Start the backend server:

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

5. Run backend tests:

```bash
npm test
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

4. Run frontend tests:

```bash
npm test
```

## API Endpoints

### GET /api/questions

- Returns all quiz questions with their answers

### POST /api/scores

- Submits a quiz score
- Body: `{ score: number }`

### GET /api/scores/distribution

- Returns the distribution of quiz scores

## Implementation Details

### Frontend

- Built with Vue 3 and Composition API
- Uses Pinia for state management
- Chart.js for data visualization
- Tailwind CSS for styling
- Jest and Vue Testing Library for testing

### Backend

- Node.js with Express
- MySQL database with Sequelize ORM
- Jest and Supertest for API testing

## Development Approach

1. **Database Design**

   - Used Sequelize models for Questions, Answers, and Scores
   - Implemented relationships between Questions and Answers

2. **API Development**

   - Created RESTful endpoints
   - Implemented error handling
   - Added input validation

3. **Frontend Implementation**

   - Component-based architecture
   - Responsive design
   - Real-time score calculation
   - Interactive quiz interface

4. **Testing**
   - Unit tests for frontend components
   - API integration tests
   - Database seeding for tests

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Additional Notes

- The database is automatically seeded with sample questions on first run
- Test database is separate from development database
- All tests use their own database instance
