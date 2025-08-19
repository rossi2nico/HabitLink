import { LineWeekly } from "./LineWeekly"
import { useHabits } from "../hooks/useHabits"
import { useState, useEffect } from 'react'
import { LineChart } from "recharts"
import { Calendar } from "./Calendar"
import { useParams } from 'react-router-dom'
import { Navigation } from "./Navigation"

export const AdvancedHabit = () => {

  const { getSyncedHabits, getHabit } = useHabits()
  const [syncedHabits, setSyncedHabits] = useState([])
  const [habit, setHabit] = useState(null)

  const { habitId } = useParams()  

  useEffect(() => {
    if (!habitId) return

    const fetchHabit = async () => {
      try {
        const res = await getHabit(habitId)
        setHabit(res)
      } catch (err) {
        console.error("Error fetching habit:", err)
      }
    }
    fetchHabit()
  }, [habitId])

  useEffect(() => {
    if (!habit) return

    const fetchSynced = async () => {
      try {
        const res = await getSyncedHabits(habit._id)

        const sortedResult = [...(res || [])].sort((a, b) => {
          const streakA = a.habitId?.streak ?? a.streak ?? 0
          const streakB = b.habitId?.streak ?? b.streak ?? 0
          return streakB - streakA
        })

        setSyncedHabits(sortedResult)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSynced()
  }, [habit])

  if (!habit) {
    return (
      <div style = {{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Navigation></Navigation>
      <h1 style = {{marginTop:'250px'}}>Loading advanced habit data ...</h1>
      </div>
  )}  

  return (
    <div className="advanced-habit">
      <Navigation></Navigation>
      <div className = "advanced-habit-info">
        <h1> { habit.name } </h1>
        <h3 style = {{color:"#afafafff", marginTop:"-15px"}}> { habit.description } </h3>
        {/* <div className = "underline"></div> */}

      </div>
      <div className = "synced-stats" style = {{marginTop: "50px"}}>
        <div className = "calendar-container">
          {/* <h3> Calendar </h3> */}
          <Calendar habit = {habit}></Calendar>

        </div>
        <div className = "completion-graph">
          <h3> Habit Mastery </h3>

          <div style = {{marginTop:"30px", height:"300px", width:"300px", backgroundColor:"transparent"}}>
            <LineWeekly habit = { habit }/>
          </div>
        </div>
        <div className = "synced-users">
          <h3> Leaderboard </h3>
          <ol>
          {syncedHabits?.map((h) => (
            <li key={h._id} style = {{padding:"5px", fontSize:"15px"}}>{ h.username } has a  { h.habitId.streak } day streak </li>
          ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
