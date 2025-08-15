import { useState } from 'react';
import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfToday, startOfWeek, endOfWeek, isSameMonth } from 'date-fns'

export const Calendar = ({ habit }) => {


  let today = startOfToday()
  let newDays = eachDayOfInterval({ 
    start: startOfWeek(startOfMonth(today)), 
    end: endOfWeek(endOfMonth(today)) })

  return (
    <div className = "calendar">  
      <header>
        <button></button>
        <p> { format(today, 'MMMM yyyy') } </p>
        <button>
          
        </button>
      </header>
      <div className = "days">
        <p>S</p><p>M</p><p>T</p><p>W</p><p>T</p><p>F</p><p>S</p>
      </div>
      <div className = "calendar-grid">
        {newDays.map(day => (
          
          <div 
            key={day.toString()} 
            style={{ border: '1px solid gray' }} 
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