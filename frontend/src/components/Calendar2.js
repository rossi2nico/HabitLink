import { useState, useMemo } from 'react';
import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfToday, startOfWeek, endOfWeek, isSameMonth, isSameDay, isAfter, parse, add, isBefore } from 'date-fns'
import { useHabits } from '../hooks/useHabits'

export const Calendar2 = ({ habit }) => {

  const { toggleComplete2 } = useHabits()
  let today = startOfToday()
  let createdAt = habit.startDate
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMMM-yyyy', new Date())
  const completionMap = habit.completions;

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

  const isDayComplete = (day) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    return dayKey in completionMap && completionMap[dayKey] > 0; // Update this with completion value requirement later
  }

  return (
    <div className = "calendar">  
      <header>
        {/* <p> &lt; user &gt;</p> */} 
        <button className="calendar-btn prev" onClick={() => prevMonth()}>&lt;</button>
        <h3 className="calendar-title">{format(firstDayCurrentMonth, 'MMMM yyyy')}</h3>
        <button className="calendar-btn next" onClick={() => nextMonth()}>&gt;</button>

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
              {isSameMonth(firstDayCurrentMonth, day) && !isAfter(day, today) && !isBefore(day, createdAt) &&
              <div
                className={`completion-circle-calendar ${isCompleted ? 'completed' : ''}`}
                //  const toggleComplete2 = async(habitId, dateCompleted, currentDate, valueCompleted) => {
                onClick={() => toggleComplete2(habit._id, format(day, 'yyyy-MM-dd'), format(today, 'yyyy-MM-dd'), 100)}
              >
                <div className="circle-ring-calendar">
                  <div className="inner-circle-calendar">
                    <time
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem',
                        // fontSize: '12px'
                      }}
                      dateTime={day.toISOString()}
                    >
                      {format(day, 'd')}
                    </time>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="36px" height="36px">
                  <defs>
                    <linearGradient id="GradientColor">
                      <stop offset="0%" stopColor="#34a5b4ff" />
                      <stop offset="100%" stopColor="#00e284ff" />
                    </linearGradient>
                  </defs>
                  <circle className = "circle-calendar" cx="18" cy="18" r="16" strokeLinecap="round" />
                </svg>

              </div>
              }
              {isSameMonth(firstDayCurrentMonth, day) && (isAfter(day, today) || isBefore(day, createdAt)) &&
                  <div
                className={`completion-circle-calendar`}
              >
                <div className="circle-ring-calendar" style = {{background:'transparent'}}>
                  <div className="inner-circle-calendar" style = {{background:'transparent'}}>
                    <time
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem',
                      }}
                      dateTime={day.toISOString()}
                    >
                      {format(day, 'd')}
                    </time>
                  </div>
                </div>
              </div>
                }
            </div>
          )
        })}
      </div>
    </div>
  )
}