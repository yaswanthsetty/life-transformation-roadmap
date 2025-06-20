import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import LifeTransformationRoadmap from './components/LifeTransformationRoadmap';
import ProgressPlans from './components/ProgressPlans';
import './App.css';

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
const NavBar = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background: ${({ theme }) => theme.card};
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.07);
  margin: 2rem auto 2.5rem auto;
  padding: 0.7rem 2.5rem;
  max-width: 600px;
`;
const StyledNavLink = styled(NavLink)`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.8rem;
  transition: background 0.2s, color 0.2s;
  &.active {
    background: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.navTextActive};
  }
  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

// Data for plans/goals (should match your roadmap)
const weeklyGoals = {
  fitness: [
    'Complete 5 workouts (mix of strength, cardio, flexibility)',
    'Hit 10,000 steps daily',
    'Try one new healthy recipe',
    'Take progress photos/measurements'
  ],
  skills: [
    'Complete current ML/CV skill module',
    'Finish one hands-on project',
    'Contribute to GitHub 5+ days',
    'Apply learnings to real problem'
  ],
  lifestyle: [
    'Maintain consistent sleep schedule',
    'Read for 3.5+ hours total',
    'Practice mindfulness 4+ times',
    'Connect with one industry professional'
  ]
};
const monthlyMilestones = [
  {
    month: 1,
    fitness: 'Establish workout routine, lose 2-4 lbs, build basic strength',
    skills: 'Master Python advanced + ML mathematics',
    lifestyle: 'Perfect morning routine, consistent sleep, reduced screen time'
  },
  {
    month: 2,
    fitness: 'Noticeable muscle definition, improved endurance, healthy eating habits',
    skills: 'Scikit-Learn mastery + first MLOps project deployed',
    lifestyle: 'Strong discipline habits, regular reading, better focus'
  },
  {
    month: 3,
    fitness: 'Significant physical transformation, improved athletic performance',
    skills: 'OpenCV mastery + real-time CV application built',
    lifestyle: 'Leadership mindset, networking actively, confident presence'
  },
  {
    month: 4,
    fitness: 'Peak physical condition, inspiring others, athletic goals achieved',
    skills: 'Deep learning CV + production ML system deployed',
    lifestyle: 'Industry connections, internship applications, personal brand'
  }
];
const workoutPlans = {
  strength: {
    title: 'Strength Training Day',
    exercises: [
      'Push-ups: 3 sets, as many as you can',
      'Squats: 3 sets of 15-20 reps',
      'Plank: 3 sets, hold for 30-60 seconds',
      'Pull-ups/Assisted pull-ups: 3 sets',
      'Lunges: 3 sets of 10 each leg',
      'Dips (using chair): 3 sets of 8-12'
    ],
    tips: 'Focus on form over speed. Rest 1-2 minutes between sets.'
  },
  cardio: {
    title: 'Cardio Day',
    exercises: [
      '20-30 minute brisk walk or light jog',
      'High-intensity intervals: 15 minutes',
      'Stair climbing for 10-15 minutes',
      'Dancing to music (make it fun!)',
      'Cycling or outdoor sports',
      'Jump rope: 3 sets of 2 minutes'
    ],
    tips: 'Aim for moderate intensity - you should be able to talk but feel challenged.'
  },
  yoga: {
    title: 'Flexibility & Recovery Day',
    exercises: [
      'Sun salutations: 5 complete rounds',
      'Warrior pose sequence (both sides)',
      'Downward dog to cobra flow',
      'Hip opener poses and twists',
      'Child pose and spinal twists',
      'Relaxation and breathing: 5 minutes'
    ],
    tips: 'Focus on breathing and gentle stretching. Listen to your body.'
  }
};

function App() {
  // You can set dark/light mode here or use state if you want a toggle
  const theme = darkTheme;
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <NavBar>
          <StyledNavLink to="/" end>Dashboard</StyledNavLink>
          <StyledNavLink to="/plans">Plans & Goals</StyledNavLink>
        </NavBar>
        <Routes>
          <Route path="/" element={<LifeTransformationRoadmap />} />
          <Route path="/plans" element={<ProgressPlans weeklyGoals={weeklyGoals} monthlyMilestones={monthlyMilestones} workoutPlans={workoutPlans} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
