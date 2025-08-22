'use client';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { useHabits } from '../hooks/useHabits';
import { useState, useEffect } from 'react'

export const BarGraphWeekly = ({ habit }) => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  
  const { getSyncedHabits } = useHabits()
  const [syncedHabits, setSyncedHabits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!habit) return
    
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await getSyncedHabits(habit._id)

        if (res.success == false) {
          setError(res.error)
        }
        else {
          setSyncedHabits(res.syncedHabits)
        }
  
      } catch (error) {
        console.error(error.message)
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

  // Generate colors for different users
  const colors = ['#ff1e00ff', '#00b4d8ff', '#90e0efff', '#0077b6ff', '#03045eff'];

  return (
    <ResponsiveContainer width="100%" height="65%">
      <BarChart data={weeklyStats} barCategoryGap="10%">
        <defs>
          <linearGradient id="GradientColor2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff1e00ff" stopOpacity={1} />
            <stop offset="100%" stopColor="#e00056ff" stopOpacity={1} />
          </linearGradient>
        </defs>
        
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

        {syncedHabits.map((syncedHabit, index) => (
          <Bar
            key={syncedHabit.habitId.username}
            dataKey={syncedHabit.habitId.username}
            name={syncedHabit.habitId.username}
            fill={colors[index + 1] || "#c4f6ff21"}
            fillOpacity={0.7}
          />
        ))}

        <Bar
          dataKey={habit.username}
          name={habit.username}
          fill="url(#GradientColor2)"
          fillOpacity={0.9}
        />
        
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            border: 'none', 
            borderRadius: '8px',
            color: '#fff'
          }}
          formatter={(value) => [`${value}%`, '']}
        />
        
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="rect"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}