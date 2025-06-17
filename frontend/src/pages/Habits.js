import { useEffect, useState } from 'react'
import { CreateHabitForm } from '../components/CreateHabitForm'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext'
import { Habit } from '../components/Habit'
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
        {/* { habits && habits.map((habit) => (
          <pre key = { habit._id }>
            { JSON.stringify(habit, null, 2)}
          </pre>
        ))} */}
        { habits && habits.map((habit) => (
          <Habit key = { habit._id } habit = { habit }></Habit>
        ))}
        <h3> Public habits: </h3>
        {/* { publicHabits && publicHabits.map((habit) => (
          <pre key = { habit._id }>
            { JSON.stringify(habit, null, 2)}
          </pre>
        ))} */}
        { publicHabits && publicHabits.map((publicHabit) => (
          <Habit key = { publicHabit._id } habit = { publicHabit }></Habit>
        ))}
      </div>
      
      <div className="create">
      </div>
      <CreateHabitForm></CreateHabitForm>
    </>
  )
}
export default Habits