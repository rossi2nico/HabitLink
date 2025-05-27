import { useEffect, useState } from 'react'
import { CreateHabitForm } from '../components/CreateHabitForm'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext'
const Habits = () => {

  const { habits } = useHabitsContext()
  const { getHabits, getPublicHabits } = useHabits()
  const { user } = useAuthContext()
  const [publicHabits, setPublicHabits] = useState()

  useEffect(() => {
    getHabits()
    const fetchPublic = async () => {
      const fetchedPublicHabits = await getPublicHabits()
      setPublicHabits(fetchedPublicHabits)
    }
    fetchPublic()
  }, [user])

  return (
    <>
      <div className="habits">
        <h3> User habits: </h3>
        { habits && habits.map((habit) => (
          <pre key = { habit._id }>
            { JSON.stringify(habit, null, 2)}
          </pre>
        ))}
        <h3> Public habits: </h3>
        { publicHabits && publicHabits.map((habit) => (
          <pre key = { habit._id }>
            { JSON.stringify(habit, null, 2)}
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