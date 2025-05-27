import { useEffect, useState } from 'react'
import { CreateHabitForm } from '../components/CreateHabitForm'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext'
const Habits = () => {

  const { habits } = useHabitsContext()
  const { getHabits } = useHabits()
  const { user } = useAuthContext()

  useEffect(() => {
    getHabits()
  }, [user])

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