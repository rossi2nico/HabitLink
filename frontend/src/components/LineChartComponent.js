'use client';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { useHabits } from '../hooks/useHabits';
import { useState, useEffect } from 'react'

export const LineChartComponent = ({ habit }) => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  
  const { getSyncedHabits } = useHabits()
  const [syncedHabits, setSyncedHabits] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!habit) return
    
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await getSyncedHabits(habit._id)    
        setSyncedHabits(res);
        console.log(`Fetched synced habits:`, res)
        
      } catch (error) {
        console.log('Error fetching synced habits:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData();
  }, [habit?._id])

  if (!habit || isLoading) {
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
    
    const weekLabel = `wk. ${weekIndex + 1}`;
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
    <ResponsiveContainer width="100%" height="75%">
      <LineChart data={weeklyStats} width={600} height={200}>
        <XAxis dataKey="date" stroke="transparent" tick={{ fill: "#424242ff", fontSize: 13 }} />
        <YAxis stroke="transparent" tick={{ fill: "#424242ff", fontSize: 13 }} tickFormatter={v => `${v}%`} domain={[0, 100]} />

        <defs>
          <filter id="shadow" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#95f7d6" floodOpacity="0.8" />
          </filter>
        </defs>
      
        {syncedHabits.map( syncedHabit =>
          <Line type = "monotone" key = { syncedHabit.habitId.username } dataKey = { syncedHabit.habitId.username } name = {syncedHabit.habitId.username }
          strokeWidth={2} stroke = "#424242ff" connectNulls = {true}
          ></Line>
        )}

        <Line type="monotone" dataKey={habit.username} name={habit.username} strokeWidth={3} animationBegin = {1000} animationDuration = {3000} stroke="#95f7d6d2" style={{ filter: "url(#shadow)" }} />


      </LineChart>
    </ResponsiveContainer>
  )
}