import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { format } from "date-fns"
import { Habit } from "../components/Habit2";
import { LineGraphHabits2 } from "../components/LineGraphHabits2";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const currentDate = format(new Date(), "yyyy-MM-dd") 

const Secret = () => {
  const { user } = useAuthContext()
  const [habits, setHabits] = useState([])

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) return

      try {
        const res = await fetch(`${BACKEND_URL}/api/habits/2/?currentDate=${currentDate}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
          },
        })

        const json = await res.json()
        setHabits(json)
      } catch (err) {
        console.error("Failed to fetch habits:", err)
      }
    }

    fetchHabits()
  }, [user, currentDate])

  const handleCreateHabit = async () => {
    if (!user) return

    try {
      const res = await fetch(`${BACKEND_URL}/api/habits/2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: "Custom",
          privacy: 0,
          startDate: currentDate
        })
      })

      const json = await res.json()
      setHabits(prev => [...prev, json])
    } catch (err) {
      console.error("Failed to create habit:", err)
    }
  }

  const handleDeleteLastHabit = async () => {
    if (!user || habits.length === 0) return
    const lastHabit = habits[habits.length - 1]

    try {
      const res = await fetch(`${BACKEND_URL}/api/habits/2/${lastHabit._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
      })

      if (res.ok) {
        setHabits(prev => prev.slice(0, -1))
      } else {
        console.error("Failed to delete habit")
      }
    } catch (err) {
      console.error("Failed to delete habit:", err)
    }
  }

  return (
    <div>
      <p>{currentDate}</p>
      {habits && habits.map(habit => (
        <Habit
          key = {habit._id} 
          habit = { habit } 
        />
      ))}
      <button className='create-habit-button' onClick={handleCreateHabit}>
        Create Habit
      </button>
      <button className='create-habit-button' onClick={handleDeleteLastHabit}>
        Delete Last Habit
      </button>
      <LineGraphHabits2 habits = {habits}></LineGraphHabits2>

    </div>
  )
}

export default Secret
