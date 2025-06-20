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
  @media (max-width: 700px) {
    padding: 1rem 0.7rem;
    margin-bottom: 1rem;
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
`;
const Checkbox = styled.input`
  width: 1.1rem;
  height: 1.1rem;
  accent-color: ${({ theme }) => theme.accent};
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
  transition: width 0.3s;
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

  // Fetch progress on mount
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setWeeklyProgress(data.weekly || {});
        setMonthlyProgress(data.monthly || {});
        setLoading(false);
      });
  }, []);

  // Save progress to backend
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
  };

  // Helper to count checked goals
  const getProgress = (progress, total) => {
    const checked = Object.values(progress).filter(Boolean).length;
    return total === 0 ? 0 : Math.round((checked / total) * 100);
  };

  return (
    <Container>
      {loading && <div style={{marginBottom:16}}>Loading progress...</div>}
      {saveMsg && <div style={{color:'#22c55e',marginBottom:16,fontWeight:600}}>{saveMsg}</div>}
      <Section>
        <Title>🏋️‍♂️ Workout Plans</Title>
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
        <Title>📅 Weekly Goals</Title>
        {Object.entries(weeklyGoals).map(([cat, goals]) => (
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
        ))}
      </Section>
      <Section>
        <Title>🏆 Monthly Milestones</Title>
        {monthlyMilestones.map((milestone, idx) => {
          const total = 3;
          const progress = monthlyProgress[idx] || {};
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
                          [idx]: { ...monthlyProgress[idx], [tIdx]: e.target.checked }
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
