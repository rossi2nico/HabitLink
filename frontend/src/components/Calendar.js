import { useState } from 'react';
import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfToday, startOfWeek, endOfWeek, isSameMonth, isSameDay, isAfter, parse, add } from 'date-fns'

export const Calendar = ({ habit }) => {

  let today = startOfToday()
  let newDays = eachDayOfInterval({ 
    start: startOfWeek(startOfMonth(today)), 
    end: endOfWeek(endOfMonth(today)) })

  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMMM-yyyy'))

  let firstDayCurrentMonth = parse(currentMonth, 'MMMM-yyyy', new Date())

  const nextMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    if (!isAfter(firstDayNextMonth, today)) {
      setCurrentMonth(format(firstDayNextMonth, 'MMMM-yyyy'))
    }
  }

  const prevMonth = () => {
    let firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayPrevMonth, 'MMMM-yyyy'))
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
        {newDays.map(day => (
          
          <div 
            key={day.toString()} 
            style={{
              color: isSameDay(today, day) 
                ? '#53e7b6fb' 
                : isAfter(day, today) 
                  ? '#666' 
                  : 'white'
            }}
            className='calendar-day'
          >
            <time
              style={{
                display: 'inline-block',
                padding: '0.25rem',
              }}
              dateTime={day.toISOString()}
            >
              {isSameMonth(today, day) && format(day, 'd')}
            </time>
          </div>
        ))}
      </div>
    </div>
  )
}