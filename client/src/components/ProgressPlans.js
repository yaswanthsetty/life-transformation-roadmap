import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1rem 3rem 1rem;
  @media (max-width: 700px) {
    padding: 1rem 0.2rem 2rem 0.2rem;
  }
`;
const Section = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.07);
  padding: 2rem 2.5rem;
  margin-bottom: 2.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.12);
  }
  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 2rem;
    right: 2rem;
    bottom: -1.25rem;
    height: 1px;
    background: ${({ theme }) => theme.border};
    opacity: 0.3;
    border-radius: 1px;
    pointer-events: none;
  }
  &:last-child::after {
    display: none;
  }
  @media (max-width: 700px) {
    padding: 1rem 0.7rem;
    margin-bottom: 1rem;
    &::after { left: 1rem; right: 1rem; }
  }
`;
const Title = styled.h2`
  font-size: 1.7rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.accent};
`;
const List = styled.ul`
  margin: 0 0 1.5rem 0;
  padding: 0 0 0 1.2rem;
`;
const GoalItem = styled.li`
  margin-bottom: 0.7rem;
  font-size: 1.13rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.15s;
  border-radius: 0.5rem;
  &:hover {
    background: ${({ theme }) => theme.accent + '11'};
  }
`;
const Checkbox = styled.input`
  width: 1.1rem;
  height: 1.1rem;
  accent-color: ${({ theme }) => theme.accent};
  cursor: pointer;
  transition: box-shadow 0.15s;
  &:focus {
    outline: 2px solid ${({ theme }) => theme.accent};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent + '33'};
  }
`;
const ProgressBar = styled.div`
  height: 10px;
  background: ${({ theme }) => theme.border};
  border-radius: 6px;
  margin-bottom: 1.2rem;
  overflow: hidden;
`;
const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.accent};
  width: ${({ percent }) => percent}%;
  transition: width 0.5s cubic-bezier(.4,1.6,.6,1);
`;
const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 2.5rem;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.navTextActive};
  padding: 1rem 2.5rem;
  border-radius: 1.2rem;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.13);
  z-index: 9999;
  opacity: 0.97;
  animation: fadeInOut 2s;
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(30px); }
    10% { opacity: 1; transform: translateX(-50%) translateY(0); }
    90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(30px); }
  }
`;

const API_URL = 'http://localhost:5000/api/progress/plans';

const ProgressPlans = ({
  weeklyGoals = {},
  monthlyMilestones = [],
  workoutPlans = {}
}) => {
  const [weeklyProgress, setWeeklyProgress] = useState({});
  const [monthlyProgress, setMonthlyProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');
  const [greeting, setGreeting] = useState('');

  // Personal greeting
  useEffect(() => {
    const hours = new Date().getHours();
    let greet = 'Welcome!';
    if (hours < 12) greet = 'Good morning! Ready to make progress?';
    else if (hours < 18) greet = 'Good afternoon! Keep going!';
    else greet = 'Good evening! Reflect and plan ahead!';
    setGreeting(greet);
  }, []);

  // Fetch progress on mount
  useEffect(() => {
    // Try to load from localStorage first
    const localWeekly = localStorage.getItem('weeklyProgress');
    const localMonthly = localStorage.getItem('monthlyProgress');
    if (localWeekly) setWeeklyProgress(JSON.parse(localWeekly));
    if (localMonthly) setMonthlyProgress(JSON.parse(localMonthly));
    setLoading(false);
  }, [weeklyGoals]);

  // Save progress to backend and localStorage
  const saveProgress = (newWeekly, newMonthly) => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekly: newWeekly, monthly: newMonthly })
    })
      .then(() => {
        setSaveMsg('Progress saved!');
        setTimeout(() => setSaveMsg(''), 1500);
      });
    localStorage.setItem('weeklyProgress', JSON.stringify(newWeekly));
    localStorage.setItem('monthlyProgress', JSON.stringify(newMonthly));
  };

  // Reset progress
  const resetProgress = () => {
    const emptyWeekly = {};
    for (const cat of Object.keys(weeklyGoals)) {
      emptyWeekly[cat] = {};
      for (let i = 0; i < (weeklyGoals[cat]?.length || 0); i++) {
        emptyWeekly[cat][i] = false;
      }
    }
    const emptyMonthly = monthlyMilestones.map(() => ({ 0: false, 1: false, 2: false }));
    setWeeklyProgress(emptyWeekly);
    setMonthlyProgress(emptyMonthly);
    saveProgress(emptyWeekly, emptyMonthly);
    setSaveMsg('Progress reset!');
    setTimeout(() => setSaveMsg(''), 1500);
  };

  // Defensive: ensure progress is always an object
  const getProgress = (progress, total) => {
    if (!progress || typeof progress !== 'object') return 0;
    if (!total || total === 0) return 0; // Defensive: no goals, no progress
    // Only count keys 0..total-1 and only if value is true
    let checked = 0;
    for (let i = 0; i < total; i++) {
      if (progress[i] === true) checked++;
    }
    return Math.round((checked / total) * 100);
  };

  return (
    <Container>
      <div style={{fontWeight:700, fontSize:'1.25rem', marginBottom:18, color:'#4a4a4a'}}>{greeting}</div>
      <button onClick={resetProgress} style={{marginBottom:24, background:'#eee', border:'none', borderRadius:8, padding:'0.5rem 1.2rem', fontWeight:600, cursor:'pointer', color:'#444', boxShadow:'0 1px 4px #0001'}}>Reset Progress</button>
      {loading && <div style={{marginBottom:16}}>Loading progress...</div>}
      {saveMsg && <Toast>{saveMsg}</Toast>}
      <Section>
        <Title>🏋️‍♂️ My Workout Plans</Title>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
          {Object.values(workoutPlans).map(plan => (
            <div key={plan.title}>
              <h3 style={{ marginBottom: 8, fontWeight: 700 }}>{plan.title}</h3>
              <List>
                {plan.exercises.map((ex, idx) => (
                  <li key={idx} style={{ fontSize: 15, marginBottom: 4 }}>{ex}</li>
                ))}
              </List>
              <div style={{ fontStyle: 'italic', color: '#888', fontSize: 13 }}>{plan.tips}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <Title>📅 My Weekly Goals</Title>
        {Object.entries(weeklyGoals).map(([cat, goals]) => {
          return (
            <div key={cat} style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 8, textTransform: 'capitalize', fontWeight: 600 }}>{cat}</h4>
              <ProgressBar>
                <ProgressFill percent={getProgress(weeklyProgress[cat] || {}, goals.length)} />
              </ProgressBar>
              <List>
                {goals.map((goal, idx) => (
                  <GoalItem key={idx}>
                    <Checkbox
                      type="checkbox"
                      checked={!!(weeklyProgress[cat]?.[idx])}
                      onChange={e => {
                        const updated = {
                          ...weeklyProgress,
                          [cat]: { ...weeklyProgress[cat], [idx]: e.target.checked }
                        };
                        setWeeklyProgress(updated);
                        saveProgress(updated, monthlyProgress);
                      }}
                    />
                    {goal}
                  </GoalItem>
                ))}
              </List>
              <div style={{ fontSize: 13, color: '#888' }}>
                {getProgress(weeklyProgress[cat] || {}, goals.length)}% complete
              </div>
            </div>
          );
        })}
      </Section>
      <Section>
        <Title>🏆 My Monthly Milestones</Title>
        {monthlyMilestones.map((milestone, idx) => {
          const total = 3;
          const progress = (monthlyProgress && typeof monthlyProgress[idx] === 'object') ? monthlyProgress[idx] : {};
          return (
            <div key={idx} style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 8, fontWeight: 600 }}>Month {milestone.month}</h4>
              <ProgressBar>
                <ProgressFill percent={getProgress(progress, total)} />
              </ProgressBar>
              <List>
                {['fitness', 'skills', 'lifestyle'].map((type, tIdx) => (
                  <GoalItem key={tIdx}>
                    <Checkbox
                      type="checkbox"
                      checked={!!progress[tIdx]}
                      onChange={e => {
                        const updated = {
                          ...monthlyProgress,
                          [idx]: { ...progress, [tIdx]: e.target.checked }
                        };
                        setMonthlyProgress(updated);
                        saveProgress(weeklyProgress, updated);
                      }}
                    />
                    <b style={{ minWidth: 70, display: 'inline-block' }}>{type.charAt(0).toUpperCase() + type.slice(1)}:</b> {milestone[type]}
                  </GoalItem>
                ))}
              </List>
              <div style={{ fontSize: 13, color: '#888' }}>
                {getProgress(progress, total)}% complete
              </div>
            </div>
          );
        })}
      </Section>
    </Container>
  );
};

export default ProgressPlans;
