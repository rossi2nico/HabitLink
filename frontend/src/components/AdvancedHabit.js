import { useHabits } from "../hooks/useHabits"
import { useState, useEffect } from 'react'

export const AdvancedHabit = ({ habit }) => {
  const { getSyncedHabits } = useHabits()
  const [syncedHabits, setSyncedHabits] = useState([])
  // const syncedHabits = getSyncedHabits(habit._id)
  useEffect(() => {
    if (!habit) return
    
    const fetchData = async () => {
      try {
        const res = await getSyncedHabits(habit._id)
        
        const sortedResult = [...(res || [])].sort((a, b) => {
          const streakA = a.habitId?.streak ?? a.streak ?? 0
          const streakB = b.habitId?.streak ?? b.streak ?? 0
          return streakB - streakA
        })

        setSyncedHabits(sortedResult);
        
      } catch (error) {
        console.log(error)
      }
    }

    fetchData();
    console.log(`synced: ${syncedHabits}`)
  }, [habit?._id])

  return (
    <div className="advanced-habit">
      <div className = "advanced-habit-info">
        <h1> { habit.name } </h1>
        <h3 style = {{color:"#afafafff", marginTop:"-15px"}}> { habit.description }</h3>
      </div>
      <div className = "synced-stats">
        <div className = "completion-graph">
          <h2> Completion Graph </h2>
          <h4 style = {{marginTop:"-12px"}}> [ 7d - 30d - 6m ]</h4>
        </div>
        <div className = "calendar">
          <h2> Calendar </h2>
        </div>
        <div className = "synced-users">
          <h2> Synced Users </h2>
          <ol>
          {syncedHabits?.map((h) => (
            <li key={h._id} style = {{padding:"5px"}}>{ h.username } has a  { h.habitId.streak } day streak </li>
          ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
