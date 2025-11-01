'use client';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { format, parseISO, addDays, isAfter, startOfDay } from 'date-fns';

export const HabitsGraph = ({ habits }) => {

  if (!habits || habits.length === 0) {
    return <div>No habits to display</div>;
  }

  let startDate = format(new Date(), 'yyyy-MM-dd')
  const currentDate = format(new Date(), 'yyyy-MM-dd')

  for (const habit of habits) {
    if (habit.startDate < startDate) startDate = habit.startDate
  }

  let checkDate = startDate
  const habitCompletions = [];

  while (checkDate <= currentDate) {
    let completedHabits = 0
    let totalHabits = 0

    for (const habit of habits) {
      if (habit.startDate <= checkDate) totalHabits += 1
      if (habit.completions[checkDate] > 0) completedHabits += 1
    }
    const completionPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0
    habitCompletions.push({
      date: checkDate,
      completion: completionPercentage,
    });

    checkDate = parseISO(checkDate)
    checkDate = addDays(checkDate, 1)
    checkDate = format(checkDate, 'yyyy-MM-dd')
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
    <ResponsiveContainer width="92%" height="80%">
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
          tick={{ fill: "#757575ff", fontSize: 12, dy: 15, dx: -15 }}
          tickFormatter={(value) => format(parseISO(value), 'MMM dd, yyyy')}
          ticks={[habitCompletions[0].date, habitCompletions[habitCompletions.length - 1].date]}
          interval="preserveStartEnd"
        />

        <YAxis
          tickFormatter={(v) => `${Math.round(v)}%`}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#ffffffff", fontSize: 13, dx: -20, dy: -3 }}
          domain={[0, 100]}
        />

        <Line
          type="monotone"
          dataKey="completion"
          stroke="url(#GradientColor2)"
          strokeWidth={4}
          dot={{ fill: '#ff1e00', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#ff1e00', strokeWidth: 2 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
