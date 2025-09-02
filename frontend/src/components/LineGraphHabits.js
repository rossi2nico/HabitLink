'use client';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { format, parseISO, addDays, isAfter, startOfDay } from 'date-fns';

export const LineGraphHabits = ({ habits }) => {

  if (!habits || habits.length === 0) {
    return <div>No habits to display</div>;
  }

  // Find earliest habit creation date
  let firstHabitCreated = new Date();
  for (const habit of habits) {
    const habitCreated = startOfDay(new Date(habit.createdAt));
    if (habitCreated < firstHabitCreated) firstHabitCreated = habitCreated;
  }

  const today = startOfDay(new Date());
  const totalHabits = habits.length;
  const habitCompletions = [];

  for (let d = firstHabitCreated; d <= today; d = addDays(d, 1)) {
    const dayStr = format(d, 'yyyy-MM-dd'); // local date string
    let completedCount = 0;

    for (const habit of habits) {
      const habitCreatedDate = startOfDay(new Date(habit.createdAt));
      if (isAfter(habitCreatedDate, d)) continue;

      const completions = new Set(
        (habit.completions || []).map(date => format(new Date(date), 'yyyy-MM-dd'))
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

  // Fix for overlapping values for chart rendering
  if (habitCompletions.length > 1) {
    if (habitCompletions[0].completion === habitCompletions[1].completion) {
      if (habitCompletions[0].completion === 0) {
        habitCompletions[1].completion += 0.001;
      } else {
        habitCompletions[0].completion -= 0.001;
      }
    }
  }

  return (
    <ResponsiveContainer width="90%" height="80%">
      <LineChart data={habitCompletions}>
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
          tickFormatter={(value) => format(parseISO(value), 'MMM dd, yyyy')}
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
};
