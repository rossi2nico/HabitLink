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

      {syncedHabits?.map((h) => (
        // <pre key = {h._id}> { JSON.stringify(h, null, 2) }</pre>
        <p key={h._id}>{ h.username } ... { h.habitId.streak } </p>
      ))}
    </div>
  )
}
