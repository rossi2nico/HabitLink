'use client';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { useHabits } from '../hooks/useHabits';
import { useState, useEffect } from 'react'
import { format } from 'date-fns';
import { parseISO } from 'date-fns';

export const LineGraphHabits = ({ habits }) => {
  
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (habits.length === 0) {
    return <div>No habits to display</div>;
  }

  let firstHabitCreated = new Date(today);

  for (const habit of habits) {
    const habitCreated = new Date(habit.createdAt);
    habitCreated.setHours(0, 0, 0, 0);
    if (habitCreated < firstHabitCreated) {
      firstHabitCreated = habitCreated;
    }
  }
  
  const habitCompletions = [];
  const totalHabits = habits.length;

  for (let d = new Date(firstHabitCreated); d <= today; d = new Date(d.getTime() + MS_PER_DAY)) {
    const dayStr = d.toISOString().split("T")[0];

    let completedCount = 0;

    for (const habit of habits) {
      const habitCreatedDate = new Date(habit.createdAt);
      habitCreatedDate.setHours(0, 0, 0, 0);
      if (habitCreatedDate > d) continue;

      const completions = new Set(
        (habit.completions || []).map(date => new Date(date).toISOString().split("T")[0])
      );

      if (completions.has(dayStr)) completedCount++;
    }

    const dailyPercentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

    habitCompletions.push({ 
      date: dayStr, 
      completion: dailyPercentage,
      formattedDate: format(d, 'MMM dd yyyy')
    });
  }

  if (habitCompletions.length > 1) {
    if (habitCompletions[0].completion === habitCompletions[1].completion) {
      if (habitCompletions[0].completion === 0) {
        habitCompletions[1].completion += 0.001;
      } else {
        habitCompletions[0].completion -= 0.001;
      }
    }
  }

  if (!habits) {
    return <div> Loading chart... </div>;
  }

  return (
    <ResponsiveContainer width="90%" height="80%">
      <LineChart data={ habitCompletions}>
        <defs>
          <linearGradient id="GradientColor2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff1e00ff" stopOpacity={1} />
            <stop offset="100%" stopColor="#e00056ff" stopOpacity={1} />
          </linearGradient>
        </defs>
        
        <XAxis
          dataKey="date"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#666", fontSize: 13, dy: 10 }}
          tickFormatter={(value) => format(parseISO(value), 'MMM dd, yyy')}
          ticks={[habitCompletions[0].date, habitCompletions[habitCompletions.length - 1].date]}
          interval="preserveStartEnd"
        />
        
        <YAxis
          tickFormatter={(v) => `${Math.round(v)}%`}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#666", fontSize: 12, dx: -20 }}
          domain={[0, 100]}
        />

        <Line
          type="monotone"
          dataKey="completion"
          stroke="url(#GradientColor2)"
          strokeWidth={3}
          dot={{ fill: '#ff1e00', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#ff1e00', strokeWidth: 2 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}