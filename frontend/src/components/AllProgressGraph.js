'use client';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { useHabits } from '../hooks/useHabits';
import { useState, useEffect } from 'react'

export const AllProgressGraph = ({ habits }) => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  
  const { getSyncedHabits } = useHabits()
  const [syncedHabits, setSyncedHabits] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  if (!habits || isLoading) {
    return <div>Loading chart...</div>
  }

  const startDate = new Date(habit.createdAt);
  startDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const firstWeekStart = new Date(startDate);
  firstWeekStart.setDate(startDate.getDate() - startDate.getDay()); // Go back to Sunday
  
  const totalDays = Math.floor((today - firstWeekStart) / MS_PER_DAY);
  const totalWeeks = Math.ceil(totalDays / 7);
  
  const weeklyStats = [];

  for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
    const weekStart = new Date(firstWeekStart);
    weekStart.setDate(firstWeekStart.getDate() + (weekIndex * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekLabel = `wk${weekIndex + 1}`;
    const weekData = { date: weekLabel };
    
    const selfCompletions = habit.completions || [];
    let selfCompletedDaysInWeek = 0;
    let totalDaysInWeek = 0;
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + dayOffset);
      
      if (currentDay > today || currentDay < startDate) {
        continue;
      }
      
      totalDaysInWeek++;
      
      const selfCompletedOnDate = selfCompletions.some(date => {
        const completionDate = new Date(date);
        return (
          completionDate.getFullYear() === currentDay.getFullYear() &&
          completionDate.getMonth() === currentDay.getMonth() &&
          completionDate.getDate() === currentDay.getDate()
        );
      });
      
      if (selfCompletedOnDate) {
        selfCompletedDaysInWeek++;
      }
    }
    
    const selfWeeklyPercentage = totalDaysInWeek > 0 ? 
      Math.round((selfCompletedDaysInWeek / totalDaysInWeek) * 100) : 0;
    
    weekData[habit.username] = selfWeeklyPercentage;
    
    for (const syncedHabit of syncedHabits) {
      const completions = syncedHabit?.habitId?.completions || [];
      let completedDaysInWeek = 0;
      
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + dayOffset);
        
        if (currentDay > today || currentDay < startDate) {
          continue;
        }
        
        const completedOnDate = completions.some(date => {
          const completionDate = new Date(date);
          return (
            completionDate.getFullYear() === currentDay.getFullYear() &&
            completionDate.getMonth() === currentDay.getMonth() &&
            completionDate.getDate() === currentDay.getDate()
          );
        });
        
        if (completedOnDate) {
          completedDaysInWeek++;
        }
      }
      
      const weeklyPercentage = totalDaysInWeek > 0 ? 
        Math.round((completedDaysInWeek / totalDaysInWeek) * 100) : 0;
      
      weekData[syncedHabit.username] = weeklyPercentage;
    }
    
    weeklyStats.push(weekData);
  }

  return (
    <ResponsiveContainer width="100%" height="65%">
      <LineChart data={weeklyStats}>
        <XAxis
          dataKey="date"
          stroke="transparent"
          tick={{ fill: "#666", fontSize: 13, dy: 10 }}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          stroke="transparent"
          tick={{ fill: "#666", fontSize: 12, dx: -20 }}
        />
        <YAxis stroke="transparent" />

        <defs>
          <linearGradient id="GradientColor2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff1e00ff" stopOpacity={1} />
            <stop offset="100%" stopColor="#e00056ff" stopOpacity={1} />
          </linearGradient>
        </defs>

        {syncedHabits.map((syncedHabit) => (
          <Line
            key={syncedHabit.habitId.username}
            type="monotone"
            dataKey={syncedHabit.habitId.username}
            name={syncedHabit.habitId.username}
            strokeWidth={2}
            stroke="#c4f6ff21"
            animationBegin={2000}
            animationDuration={500}
            connectNulls
          />
        ))}

        <Line
          type="monotone"
          dataKey={habit.username}
          name={habit.username}
          strokeLinecap="round"
          strokeWidth={4}
          stroke="url(#GradientColor2)"
          animationDuration={2500}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>

  )
}