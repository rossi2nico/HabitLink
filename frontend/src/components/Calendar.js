import { useState, useMemo } from 'react';
import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfToday, startOfWeek, endOfWeek, isSameMonth, isSameDay, isAfter, parse, add, isBefore } from 'date-fns'

export const Calendar = ({ habit, toggleComplete }) => {

  const completions = habit.completions;
  console.log("completions", completions)

  let today = startOfToday()
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMMM-yyyy', new Date())
  const createdAt = new Date(habit.createdAt)

  const nextMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    if (!isAfter(firstDayNextMonth, today)) {
      setCurrentMonth(format(firstDayNextMonth, 'MMMM-yyyy'))
    }
  }

  const prevMonth = () => {
    let firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 })
    if (!isBefore(firstDayPrevMonth, startOfMonth(createdAt))) {
      setCurrentMonth(format(firstDayPrevMonth, 'MMMM-yyyy'))
    }
  }

  let newDays = eachDayOfInterval({ 
    start: startOfWeek(startOfMonth(firstDayCurrentMonth)), 
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)) 
  })

  // Optimized: Create a Set of completion dates for O(1) lookups
  // This runs once per render when completions change
  const completionSet = useMemo(() => {
    return new Set(
      habit.completions.map(completionDate => 
        format(new Date(completionDate), 'yyyy-MM-dd')
      )
    );
  }, [habit.completions]);

  // O(1) lookup instead of O(n)
  const isDayComplete = (day) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    return completionSet.has(dayKey);
  }

  return (
    <div className = "calendar">  
      <header>
        <button onClick = {() => prevMonth()}>prev</button>
        <p> { format(firstDayCurrentMonth, 'MMMM yyyy') } </p>
        <button onClick = {() => nextMonth()}>
          next
        </button>
      </header>
      <div className = "days">
        <p>S</p><p>M</p><p>T</p><p>W</p><p>T</p><p>F</p><p>S</p>
      </div>
      <div className = "calendar-grid">
        {newDays.map(day => {
          const isCompleted = isDayComplete(day);
          
          return (
            <div 
              key={day.toString()} 
              style={{
                color: isSameDay(today, day) 
                  ? '#53e7b6fb' 
                  : isAfter(day, today) || isBefore(day, createdAt)
                    ? '#666' 
                    : 'white'
              }}
              className='calendar-day'
            >
              {isSameMonth(firstDayCurrentMonth, day) && 
              <div
                className={`completion-circle-calendar ${isCompleted ? 'completed' : ''}`}
                onClick={() => toggleComplete(habit, day)}
              >
                <div className="circle-ring-calendar">
                  <div className="inner-circle-calendar">
                    <time
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem',
                        fontSize: '12px'
                      }}
                      dateTime={day.toISOString()}
                    >
                      {format(day, 'd')}
                    </time>
                  </div>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px" height="30px">
                  <defs>
                    <linearGradient id="GradientColor">
                      <stop offset="0%" stopColor="#71ada5" />
                      <stop offset="100%" stopColor="#53e7a99c" />
                    </linearGradient>
                  </defs>
                  <circle cx="15" cy="15" r="13.5" strokeLinecap="round" />
                </svg>

              </div>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}