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
        console.log(`res: ${res}`)
        setSyncedHabits(res);
      } catch (error) {
        console.log(error)
      }
    }

    fetchData();
    console.log(`synced: ${syncedHabits}`)
  }, [habit?._id])

  return (
    <div className="advanced-habit">
      {/* <pre>
        <code>{JSON.stringify(syncedHabits, null, 2)}</code>
      </pre>       */}
      {syncedHabits?.map((h) => (
        // <pre key = {h._id}> { JSON.stringify(h, null, 2) }</pre>
        <p key={h._id}>{ h.username } ... { h.habitId.streak } </p>
      ))}
    </div>
  )
}
