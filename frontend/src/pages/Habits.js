import { useEffect, useState } from 'react'
import { CreateHabitForm } from '../components/CreateHabitForm'
const Habits = () => {
  
  const [habits, setHabits] = useState([])
  useEffect(() => {
    const fetchHabits = async () => {
      const res = await fetch('/api/habits')
      const json = await res.json()
      setHabits(json);
      console.log('Habits have been successfully fetched');
    }
    fetchHabits();
  }, [])

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