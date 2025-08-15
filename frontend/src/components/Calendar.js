import { useState } from 'react';
import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfToday } from 'date-fns'

export const Calendar = ({ habit }) => {


  let today = startOfToday()
  let newDays = eachDayOfInterval({ 
    start: startOfMonth(today), 
    end: endOfMonth(today) })

  console.log(newDays)

  return (
    <div className = "calendar">  
      <div className = "days">
        {newDays.map(day => (
          <>
            <time dateTime = { day.date }> { format(day, 'd') } </time>          
          </>
        ))}
      </div>
    </div>
  )
}