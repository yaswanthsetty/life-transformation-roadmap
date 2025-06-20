import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { CheckCircle, Circle, Star, Trophy } from 'lucide-react';
import dayjs from 'dayjs';
import ProgressDetails from './ProgressDetails';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const lightTheme = {
  background: '#f5f6fa',
  card: '#fff',
  text: '#222',
  accent: '#2563eb',
  border: '#e0e0e0',
  nav: '#f0f4fa',
  navActive: '#2563eb',
  navText: '#222',
  navTextActive: '#fff',
};
const darkTheme = {
  background: '#181a1b',
  card: '#23272f',
  text: '#f5f6fa',
  accent: '#60a5fa',
  border: '#333',
  nav: '#23272f',
  navActive: '#60a5fa',
  navText: '#f5f6fa',
  navTextActive: '#181a1b',
};
const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: 'Inter', Arial, sans-serif;
    margin: 0;
    transition: background 0.3s, color 0.3s;
  }
`;
const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem 1rem;
  min-height: 100vh;
  @media (max-width: 700px) {
    padding: 1rem 0.2rem 2rem 0.2rem;
  }
`;
const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.07);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${({ theme }) => theme.border};
  @media (max-width: 700px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;
const ThemeToggle = styled.button`
  position: fixed;
  top: 1.5rem;
  right: 2rem;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07);
`;

const API_URL = 'http://localhost:5000/api/progress';
const GOALS_API = 'http://localhost:5000/api/goals';

const LifeTransformationRoadmap = () => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [currentWeek, setCurrentWeek] = useState(1);
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [progressHistory, setProgressHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [dailyGoals, setDailyGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalText, setEditGoalText] = useState('');
  const themeObj = theme === 'light' ? lightTheme : darkTheme;

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const dailySchedule = {
    morning: [
      { id: 'wake', time: '6:30 AM', task: 'Wake up + 5 min stretching', category: 'fitness', points: 10 },
      { id: 'workout', time: '6:45 AM', task: '30-45 min workout (strength/cardio/yoga)', category: 'fitness', points: 20 },
      { id: 'shower', time: '7:30 AM', task: 'Cold shower (builds mental toughness)', category: 'wellness', points: 5 },
      { id: 'breakfast', time: '8:00 AM', task: 'Healthy breakfast + multivitamin', category: 'nutrition', points: 10 },
      { id: 'college', time: '9:00 AM', task: 'College classes (stay focused!)', category: 'academics', points: 15 }
    ],
    afternoon: [
      { id: 'lunch', time: '1:00 PM', task: 'Nutritious lunch + 20 min walk', category: 'nutrition', points: 10 },
      { id: 'college2', time: '2:00 PM', task: 'Afternoon classes', category: 'academics', points: 15 },
      { id: 'transition', time: '4:30 PM', task: '30 min break: hydrate, snack, plan evening', category: 'wellness', points: 5 }
    ],
    evening: [
      { id: 'skill1', time: '5:00 PM', task: 'ML/CV Learning (1 hour focused study)', category: 'skills', points: 25 },
      { id: 'skill2', time: '6:00 PM', task: 'Hands-on coding/projects (45 min)', category: 'skills', points: 20 },
      { id: 'portfolio', time: '6:45 PM', task: 'GitHub/Portfolio update (15 min)', category: 'skills', points: 10 },
      { id: 'dinner', time: '7:00 PM', task: 'Healthy dinner', category: 'nutrition', points: 10 },
      { id: 'reading', time: '8:00 PM', task: '30 min reading (personal development)', category: 'growth', points: 10 },
      { id: 'reflection', time: '9:00 PM', task: '10 min daily reflection + planning', category: 'wellness', points: 10 },
      { id: 'sleep', time: '10:30 PM', task: 'Sleep (7-8 hours essential!)', category: 'wellness', points: 15 }
    ]
  };

  // Load progress history and streak from server
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setProgressHistory(data.history || []);
        setStreak(data.streak || 0);
        const today = dayjs().format('YYYY-MM-DD');
        const todayEntry = (data.history || []).find(entry => entry.date === today);
        if (todayEntry) setCompletedTasks(new Set(todayEntry.completedTasks));
        else setCompletedTasks(new Set());
        setInitialLoad(false); // Mark initial load complete
      });
  }, []);

  // Save today's progress to server (autosave, but skip on initial load)
  useEffect(() => {
    if (initialLoad) return;
    const today = dayjs().format('YYYY-MM-DD');
    const points = getDailyPoints().completed;
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedTasks: Array.from(completedTasks), points, date: today })
    });
  }, [completedTasks]);

  // Save today's progress to server (manual save)
  const handleSaveProgress = () => {
    setIsSaving(true);
    const today = dayjs().format('YYYY-MM-DD');
    const points = getDailyPoints().completed;
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completedTasks: Array.from(completedTasks), points, date: today })
    })
      .then(() => {
        // After saving, fetch latest progress to update UI
        fetch(API_URL)
          .then(res => res.json())
          .then(data => {
            setProgressHistory(data.history || []);
            setStreak(data.streak || 0);
            const todayEntry = (data.history || []).find(entry => entry.date === today);
            if (todayEntry) setCompletedTasks(new Set(todayEntry.completedTasks));
          });
        setSaveMessage('Progress saved!');
        setTimeout(() => setSaveMessage(''), 2000);
      })
      .finally(() => setIsSaving(false));
  };

  // Fetch daily goals from backend
  useEffect(() => {
    fetch(GOALS_API + '?type=daily')
      .then(res => res.json())
      .then(goals => {
        setDailyGoals(goals);
        setLoadingGoals(false);
      });
  }, []);

  // Add a new daily goal
  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    fetch(GOALS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'daily', text: newGoalText, points: 10, period: 'custom', category: 'custom' })
    })
      .then(res => res.json())
      .then(goal => {
        setDailyGoals([...dailyGoals, goal]);
        setNewGoalText('');
      });
  };

  // Edit a daily goal
  const handleEditGoal = (goal) => {
    setEditingGoalId(goal._id);
    setEditGoalText(goal.text);
  };
  const handleSaveEditGoal = (goal) => {
    fetch(GOALS_API + '/' + goal._id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editGoalText })
    })
      .then(res => res.json())
      .then(updated => {
        setDailyGoals(dailyGoals.map(g => g._id === goal._id ? { ...g, text: updated.text } : g));
        setEditingGoalId(null);
        setEditGoalText('');
      });
  };
  const handleCancelEdit = () => {
    setEditingGoalId(null);
    setEditGoalText('');
  };

  // Remove a daily goal
  const handleRemoveGoal = (id, isDefault) => {
    fetch(GOALS_API + '/' + id, { method: 'DELETE' })
      .then(() => setDailyGoals(dailyGoals.filter(g => g._id !== id)));
  };

  // Merge custom daily goals into schedule for progress tracking
  const customTasks = dailyGoals.map(goal => ({
    id: 'custom-' + goal._id,
    time: '',
    task: goal.text,
    category: goal.category || 'custom',
    points: goal.points || 10
  }));

  // Load custom schedule from localStorage or use default
  const [customSchedule, setCustomSchedule] = useState(() => {
    const saved = localStorage.getItem('customSchedule');
    return saved ? JSON.parse(saved) : dailySchedule;
  });

  // Save custom schedule to localStorage on change
  useEffect(() => {
    localStorage.setItem('customSchedule', JSON.stringify(customSchedule));
  }, [customSchedule]);

  // Edit/remove logic for schedule events
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [editTaskTime, setEditTaskTime] = useState('');

  const handleEditScheduleTask = (period, idx) => {
    setEditingTask({ period, idx });
    setEditTaskText(customSchedule[period][idx].task);
    setEditTaskTime(customSchedule[period][idx].time);
  };
  const handleSaveScheduleTask = () => {
    const { period, idx } = editingTask;
    const updated = { ...customSchedule };
    updated[period][idx] = {
      ...updated[period][idx],
      task: editTaskText,
      time: editTaskTime
    };
    setCustomSchedule(updated);
    setEditingTask(null);
    setEditTaskText('');
    setEditTaskTime('');
  };
  const handleRemoveScheduleTask = (period, idx) => {
    const updated = { ...customSchedule };
    updated[period] = updated[period].filter((_, i) => i !== idx);
    setCustomSchedule(updated);
  };

  // Combine all tasks for progress calculation
  const allTasks = [
    ...dailySchedule.morning,
    ...dailySchedule.afternoon,
    ...dailySchedule.evening,
    ...customTasks
  ];

  // Updated getDailyPoints to use allTasks
  const getDailyPoints = () => {
    const completedPoints = allTasks
      .filter(task => completedTasks.has(task.id))
      .reduce((sum, task) => sum + task.points, 0);
    const totalPoints = allTasks.reduce((sum, task) => sum + task.points, 0);
    return { completed: completedPoints, total: totalPoints };
  };

  const points = getDailyPoints();
  const progressPercentage = Math.round((points.completed / points.total) * 100);

  return (
    <ThemeProvider theme={themeObj}>
      <GlobalStyle />
      <ThemeToggle onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </ThemeToggle>
      <Container>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: 8 }}>
            🚀 Complete Life Transformation Roadmap
          </h1>
          <p style={{ color: themeObj.text + 'cc', marginBottom: 24 }}>
            ML Engineer + Computer Vision Skills + Peak Physical Fitness + Elite Lifestyle
          </p>
          {/* Daily Progress Dashboard */}
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Today's Progress</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, background: themeObj.accent + '22', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: themeObj.accent }}>{progressPercentage}%</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 700, color: themeObj.accent }}>{points.completed}/{points.total}</p>
                    <p style={{ fontSize: 13, color: themeObj.text + '99' }}>points today</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Week {currentWeek} Focus</h3>
                <p style={{ fontSize: 13, color: themeObj.text + '99' }}>Building foundation habits + Python mastery</p>
                <button onClick={() => setCurrentWeek(Math.min(16, currentWeek + 1))} style={{ color: themeObj.accent, background: 'none', border: 'none', fontWeight: 500, fontSize: 13, marginTop: 4, cursor: 'pointer' }}>
                  Complete Week →
                </button>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Transformation Streak</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Trophy style={{ width: 20, height: 20, color: '#fbbf24' }} />
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#fbbf24' }}>{streak}</span>
                  <span style={{ fontSize: 13, color: themeObj.text + '99' }}>days</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
        {/* Analytics Section */}
        <AnalyticsCard>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18, color: themeObj.text }}>📈 Progress Analytics</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={progressHistory.slice().reverse().map(entry => ({
              date: entry.date.slice(5),
              points: entry.points || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{fontSize:12}} />
              <YAxis tick={{fontSize:12}} />
              <Tooltip />
              <Line type="monotone" dataKey="points" stroke={themeObj.accent} strokeWidth={3} dot={{r:3}} />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>
        {/* Content Sections */}
        <div style={{ minHeight: 400 }}>
          {/* Daily Goals Section - moved to top */}
          {loadingGoals ? (
            <div>Loading goals...</div>
          ) : (
            <Card>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, color: themeObj.text }}>Daily Goals</h2>
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {dailyGoals.map(goal => (
                  <li key={goal._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${themeObj.border}` }}>
                    {editingGoalId === goal._id ? (
                      <>
                        <input
                          value={editGoalText}
                          onChange={e => setEditGoalText(e.target.value)}
                          style={{ flex: 1, marginRight: 8, padding: 6, borderRadius: 6, border: `1px solid ${themeObj.border}` }}
                        />
                        <button onClick={() => handleSaveEditGoal(goal)} style={{ background: themeObj.accent, color: themeObj.navTextActive, border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, marginRight: 4, cursor: 'pointer' }}>Save</button>
                        <button onClick={handleCancelEdit} style={{ background: '#ccc', color: '#222', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <span>{goal.text}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => handleEditGoal(goal)}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemoveGoal(goal._id, false)}
                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <input
                  value={newGoalText}
                  onChange={e => setNewGoalText(e.target.value)}
                  placeholder="Add a new goal..."
                  style={{ flex: 1, padding: 8, borderRadius: 6, border: `1px solid ${themeObj.border}` }}
                />
                <button onClick={handleAddGoal} style={{ background: themeObj.accent, color: themeObj.navTextActive, border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
                  Add
                </button>
              </div>
            </Card>
          )}
          {/* Daily Schedule Section */}
          {Object.entries(customSchedule).map(([period, tasks]) => (
            <Card key={period}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, textTransform: 'capitalize', color: themeObj.text }}>{period}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tasks.map((task, idx) => (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, border: `1px solid ${themeObj.border}`, background: completedTasks.has(task.id) ? themeObj.background : themeObj.card, boxShadow: completedTasks.has(task.id) ? 'none' : '0 1px 4px 0 rgba(0,0,0,0.03)', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', transform: 'scale(1)', transition: 'transform 0.1s' }}
                      >
                        {completedTasks.has(task.id) ? 
                          <CheckCircle style={{ width: 24, height: 24, color: '#22c55e' }} /> : 
                          <Circle style={{ width: 24, height: 24, color: '#cbd5e1' }} />
                        }
                      </button>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                          {editingTask && editingTask.period === period && editingTask.idx === idx ? (
                            <>
                              <input value={editTaskTime} onChange={e => setEditTaskTime(e.target.value)} style={{ width: 80, marginRight: 8, borderRadius: 6, border: `1px solid ${themeObj.border}` }} />
                              <input value={editTaskText} onChange={e => setEditTaskText(e.target.value)} style={{ width: 220, borderRadius: 6, border: `1px solid ${themeObj.border}` }} />
                              <button onClick={handleSaveScheduleTask} style={{ marginLeft: 8, background: themeObj.accent, color: themeObj.navTextActive, border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                              <button onClick={() => setEditingTask(null)} style={{ marginLeft: 4, background: '#ccc', color: '#222', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <span style={{ fontWeight: 500, color: themeObj.accent }}>{task.time}</span>
                              <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500, border: `1px solid ${themeObj.border}`, background: themeObj.background, color: themeObj.text }}>{task.category}</span>
                              <span style={{ marginLeft: 8 }}>{task.task}</span>
                            </>
                          )}
                        </div>
                        <p style={{ textDecoration: completedTasks.has(task.id) ? 'line-through' : 'none', color: completedTasks.has(task.id) ? themeObj.text + '88' : themeObj.text, fontWeight: 400 }}></p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Star style={{ width: 18, height: 18, color: '#fbbf24' }} />
                      <span style={{ fontWeight: 500, color: '#fbbf24' }}>{task.points}</span>
                      <button onClick={() => handleEditScheduleTask(period, idx)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer', marginLeft: 8 }}>Edit</button>
                      <button onClick={() => handleRemoveScheduleTask(period, idx)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer', marginLeft: 4 }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          {/* Custom Daily Goals Section (interactive) */}
          {customTasks.length > 0 && (
            <Card>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14, color: themeObj.text }}>Custom Daily Goals</h2>
              <ul style={{ padding: 0, listStyle: 'none' }}>
                {customTasks.map(task => (
                  <li key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${themeObj.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        onClick={() => toggleTask(task.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', transform: 'scale(1)', transition: 'transform 0.1s' }}
                      >
                        {completedTasks.has(task.id) ? 
                          <CheckCircle style={{ width: 22, height: 22, color: '#22c55e' }} /> : 
                          <Circle style={{ width: 22, height: 22, color: '#cbd5e1' }} />
                        }
                      </button>
                      <span style={{ fontSize: 16 }}>{task.task}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Star style={{ width: 16, height: 16, color: '#fbbf24' }} />
                      <span style={{ fontWeight: 500, color: '#fbbf24' }}>{task.points}</span>
                      <button
                        onClick={() => handleRemoveGoal(task.id.replace('custom-', ''), false)}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer', marginLeft: 8 }}
                        title="Remove goal"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {/* Nutrition Guide */}
          <Card>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18, color: themeObj.text }}>🥗 Daily Nutrition Guidelines</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {nutritionTips.map((tip, idx) => (
                <p key={idx} style={{ fontSize: 15, color: themeObj.text, background: themeObj.background, padding: 10, borderRadius: 8, margin: 0 }}>{tip}</p>
              ))}
            </div>
          </Card>
        </div>
        {/* Progress History Section */}
        <ProgressDetails history={progressHistory} />
        {/* Save Progress Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button
            onClick={handleSaveProgress}
            disabled={isSaving}
            style={{
              padding: '0.7rem 2rem',
              borderRadius: '0.8rem',
              border: 'none',
              background: themeObj.accent,
              color: themeObj.navTextActive,
              fontWeight: 600,
              fontSize: 16,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {isSaving ? 'Saving...' : 'Save Progress'}
          </button>
          {saveMessage && <span style={{ color: themeObj.accent, fontWeight: 500 }}>{saveMessage}</span>}
        </div>
        {/* Success Principles Footer */}
        <Card style={{ background: themeObj.accent + '11', marginTop: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: themeObj.text }}>🎯 Your Transformation Principles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, fontSize: 15 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p><strong>Consistency &gt; Perfection:</strong> 80% consistency beats 100% for 3 days</p>
              <p><strong>Systems &gt; Goals:</strong> Trust the daily process, results will follow</p>
              <p><strong>Progress &gt; Speed:</strong> Small daily improvements compound massively</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p><strong>Identity &gt; Outcome:</strong> Become someone who works out & codes daily</p>
              <p><strong>Discipline = Freedom:</strong> Structure now = options later</p>
              <p><strong>Document Everything:</strong> Track progress, celebrate wins, learn from setbacks</p>
            </div>
          </div>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default LifeTransformationRoadmap;

const AnalyticsCard = styled(Card)`
  padding: 2rem 2rem 1.5rem 2rem;
  @media (max-width: 700px) {
    padding: 1rem 0.5rem 1rem 0.5rem;
  }
`;
