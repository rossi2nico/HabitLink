'use client';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { useHabits } from '../hooks/useHabits';
import { useState, useEffect } from 'react'
import { format } from 'date-fns';

export const LineGraphHabits = ({ habits }) => {
  
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (habits.length == 0) {
    return
  }
  let firstHabitCreated = new Date(today);

  for (const habit of habits) {
    const habitCreated = new Date(habit.createdAt);
    habitCreated.setHours(0, 0, 0, 0)
    if (habitCreated < firstHabitCreated) {
      firstHabitCreated = habitCreated;
    }
  }
  console.log("first start date:", firstHabitCreated)  
  
  // a list of habits, with completion sets 
  // Return a hashmap of hashmaps (mapdates[date]: maphabits[habit]: value at that date) 

  const habitCompletions = [];
  const totalHabits = habits.length;

  for (let d = new Date(firstHabitCreated); d <= today; d = new Date(d.getTime() + MS_PER_DAY)) {
    const dayStr = d.toISOString().split("T")[0];

    let completedCount = 0;

    for (const habit of habits) {
      if (new Date(habit.createdAt) > d) continue; // habit not created yet

      const completions = new Set(
        (habit.completions || []).map(date => new Date(date).toISOString().split("T")[0])
      );

      if (completions.has(dayStr)) completedCount++;
    }

    const dailyPercentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

    habitCompletions.push({ date: dayStr, completion: dailyPercentage });
  }

  console.log("cl:", habitCompletions)
  if (!habits) {
    return <div>Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="90%" height="80%">
      <LineChart data={ habitCompletions }>
        <XAxis
          dataKey="date"
          type="category"
          stroke="transparent"
            ticks={[habitCompletions[0].date, habitCompletions[habitCompletions.length - 1].date]} // only first & last
            tick={{ fill: "#666", fontSize: 13, dy: 10 }}
            tickFormatter={(value) => format(new Date(value), 'MMM dd yyyy')}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          stroke="transparent"
          tick={{ fill: "#666", fontSize: 12, dx: -20 }}
        />

        <defs>
          <linearGradient id="GradientColor2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff1e00ff" stopOpacity={1} />
            <stop offset="100%" stopColor="#e00056ff" stopOpacity={1} />
          </linearGradient>
        </defs>

        <Line
          type="monotone"
          dataKey="completion"
          stroke="url(#GradientColor2)"
          strokeWidth={3}
          dot={{ fill: '#ff1e00', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#ff1e00', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>

  )
}