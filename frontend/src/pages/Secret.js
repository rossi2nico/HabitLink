import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { format } from "date-fns"
import { Habit } from "../components/Habit";
import { HabitsGraph } from "../components/HabitsGraph";
import { useHabitsContext } from "../hooks/useHabitsContext"
import { useHabits } from "../hooks/useHabits";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Secret = () => {
  const { user } = useAuthContext()
  const { getHabits, createHabit, deleteHabit } = useHabits()
  const { habits } = useHabitsContext();
  const currentDate = format(new Date(), "yyyy-MM-dd") 

  useEffect(() => {
    if (!user) return
    console.log("fetching habits and current date is:", currentDate)
    getHabits(currentDate)
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
      <button className='create-habit-button' onClick={() => createHabit("New Habit")}>
        Create Habit
      </button>
      <button className='create-habit-button' onClick={() => deleteHabit(habits[habits.length - 1]._id)}>
        Delete Last Habit
      </button>
      <HabitsGraph habits = {habits}></HabitsGraph>

    </div>
  )
}

export default Secret
