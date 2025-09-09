import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { format } from "date-fns"
import { Habit } from "../components/Habit2";
import { LineGraphHabits2 } from "../components/LineGraphHabits2";
import { useHabitsContext } from "../hooks/useHabitsContext"
import { useHabits } from "../hooks/useHabits";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const Secret = () => {
  const { user } = useAuthContext()
  const { getHabits2, createHabit2, deleteHabit2 } = useHabits()
  const { habits } = useHabitsContext();
  const currentDate = format(new Date(), "yyyy-MM-dd") 

  useEffect(() => {
    if (!user) return
    console.log("fetching habits and current date is:", currentDate)
    getHabits2(currentDate)
  }, [user, currentDate])

  return (
    <div>
      <p>{currentDate}</p>
      {habits && habits.map(habit => (
        console.log("habit in map: ", habit) ||
        <Habit
          key = {habit._id} 
          habit = { habit } 
        />
      ))}
      <button className='create-habit-button' onClick={() => createHabit2("New Habit")}>
        Create Habit
      </button>
      <button className='create-habit-button' onClick={() => deleteHabit2(habits[habits.length - 1]._id)}>
        Delete Last Habit
      </button>
      <LineGraphHabits2 habits = {habits}></LineGraphHabits2>

    </div>
  )
}

export default Secret
