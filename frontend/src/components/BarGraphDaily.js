'use client';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { useHabits } from '../hooks/useHabits';
import { useState, useEffect } from 'react'

export const BarGraphDaily = ({ habit }) => {
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get start of current week (Sunday)
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);
  
  const dailyStats = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate data for each day of the current week
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const currentDay = new Date(currentWeekStart);
    currentDay.setDate(currentWeekStart.getDate() + dayIndex);
    
    // Skip future days
    if (currentDay > today) {
      break;
    }
    
    const dayLabel = daysOfWeek[dayIndex];
    const dayData = { date: dayLabel, fullDate: currentDay.toISOString() };
    
    // Check if user completed habit on this day
    const selfCompletions = habit.completions || [];
    const selfCompletedOnDate = selfCompletions.some(date => {
      const completionDate = new Date(date);
      return (
        completionDate.getFullYear() === currentDay.getFullYear() &&
        completionDate.getMonth() === currentDay.getMonth() &&
        completionDate.getDate() === currentDay.getDate()
      );
    });
    
    dayData[habit.username] = selfCompletedOnDate ? 100 : 0;
    
    // Check synced habits for this day
    for (const syncedHabit of syncedHabits) {
      const completions = syncedHabit?.habitId?.completions || [];
      const completedOnDate = completions.some(date => {
        const completionDate = new Date(date);
        return (
          completionDate.getFullYear() === currentDay.getFullYear() &&
          completionDate.getMonth() === currentDay.getMonth() &&
          completionDate.getDate() === currentDay.getDate()
        );
      });
      
      dayData[syncedHabit.habitId.username] = completedOnDate ? 100 : 0;
    }
    
    dailyStats.push(dayData);
  }

  // Generate colors for different users
  const colors = ['#ff1e00ff', '#00b4d8ff', '#90e0efff', '#0077b6ff', '#03045eff'];

  return (
    <ResponsiveContainer width="100%" height="50%">
      <BarChart data={dailyStats} barCategoryGap="10%">
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
          domain={[0, 100]}
          tickFormatter={(v) => v === 100 ? "100%" : "0%"}
          stroke="transparent"
          tick={{ fill: "#666", fontSize: 12, dx: -20 }}
          ticks={[0, 100]}
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
          formatter={(value, name) => [value === 100 ? "Completed" : "Not completed", name]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="rect"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}