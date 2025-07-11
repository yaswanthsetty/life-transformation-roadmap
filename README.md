# Life Transformation Roadmap

A beautiful, modern, and responsive full-stack web app for daily schedule, progress tracking, and personal transformation. Built with React (styled-components) frontend and Express + MongoDB backend.

## Features
- **Daily, Weekly, Monthly Goals:** Add, edit, remove, and track your goals with persistent history and streaks.
- **Customizable Schedule:** Edit and remove morning, afternoon, and evening events. Changes persist in your browser.
- **Progress Analytics:** Visualize your progress with charts and streak counters.
- **Mobile Responsive:** Fully responsive UI with dark/light mode toggle (dark by default).
- **Modern UI:** Built with styled-components for a clean, beautiful look (no Tailwind).
- **Backend:** Express.js REST API with MongoDB for persistent data storage.

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yaswanthsetty/life-transformation-roadmap.git
   cd life-transformation-roadmap
   ```
2. **Install dependencies:**
   ```sh
   cd server && npm install
   cd ../client && npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the `server` folder for MongoDB connection (optional, defaults to localhost).

4. **Seed default goals (optional, first run only):**
   ```sh
   cd server
   node seedGoals.js
   ```

5. **Start the backend:**
   ```sh
   cd server
   npm start
   ```
6. **Start the frontend:**
   ```sh
   cd client
   npm start
   ```

7. **Open your browser:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Folder Structure
```
life-transformation-roadmap/
├── client/   # React frontend (styled-components)
├── server/   # Express backend (MongoDB, REST API)
├── .gitignore
├── README.md
```

## Customization
- **Edit/Remove Schedule:** You can edit or remove any default schedule event (morning, afternoon, evening) directly in the UI. Changes are saved in your browser.
- **Add/Edit/Remove Goals:** Manage your daily, weekly, and monthly goals from the dashboard.
- **Dark/Light Mode:** Toggle theme from the top right corner.

## Deployment
- Build the frontend with `npm run build` in the `client` folder for production.
- Deploy backend and frontend to your preferred platform (Heroku, Vercel, Render, etc.).

## License
MIT

---

**Made with ❤️ for personal growth and productivity!**
