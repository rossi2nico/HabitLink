import { useEffect, useState } from 'react'
import { CreateHabitForm } from '../components/CreateHabitForm'
import { useHabitsContext } from '../hooks/useHabitsContext'
const Habits = () => {
  
  const { habits, dispatch } = useHabitsContext()
  useEffect(() => {
    const fetchHabits = async () => {
      const res = await fetch('/api/habits')
      const json = await res.json()
      if (res.ok) {
        dispatch({ type: 'SET_HABITS', payload: json })
        console.log('Habits have been successfully fetched')
      }
      console.log('Habits have been successfully fetched');
    }
    fetchHabits();
  }, [dispatch])

  return (
    <>
      <div className="habits">
        {habits && habits.map((habit) => (
          <pre key={habit._id}>
            {JSON.stringify(habit, null, 2)}
          </pre>
        ))}
      </div>
      
      <div className="create">
      </div>
      <CreateHabitForm></CreateHabitForm>
    </>
  )
}
export default Habits