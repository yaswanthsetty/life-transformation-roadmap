import React, { useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.07);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const DateList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;
const DateButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.7rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ active, theme }) => (active ? theme.accent : theme.card)};
  color: ${({ active, theme }) => (active ? theme.navTextActive : theme.text)};
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
`;

const ProgressDetails = ({ history }) => {
  const [selectedDate, setSelectedDate] = useState(history.length > 0 ? history[0].date : null);
  const selectedEntry = history.find(entry => entry.date === selectedDate);

  return (
    <Card>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>📅 Previous Days Progress</h2>
      <DateList>
        {history.map(entry => (
          <DateButton
            key={entry.date}
            active={selectedDate === entry.date}
            onClick={() => setSelectedDate(entry.date)}
          >
            {dayjs(entry.date).format('MMM D, YYYY')}
          </DateButton>
        ))}
      </DateList>
      {selectedEntry ? (
        <div>
          <h3 style={{ marginBottom: 8 }}>Completed Tasks</h3>
          {selectedEntry.completedTasks && selectedEntry.completedTasks.length > 0 ? (
            <ul>
              {selectedEntry.completedTasks.map((task, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>{task}</li>
              ))}
            </ul>
          ) : (
            <p>No tasks completed on this day.</p>
          )}
          <p style={{ marginTop: 12, fontWeight: 500 }}>Points: {selectedEntry.points}</p>
        </div>
      ) : (
        <p>Select a date to view details.</p>
      )}
    </Card>
  );
};

export default ProgressDetails;
