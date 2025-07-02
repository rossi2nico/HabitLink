import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'
import { Navigation } from '../components/Navigation'

const Users = () => {
  
  const [users, setUsers] = useState([])
  const { getTargetHabits, syncHabit } = useHabits()
  const [targetHabits, setTargetHabits] = useState([])

  useEffect(() => { 
    const fetchUsers = async () => {
      const res = await fetch ('/api/users/')
      const json = await res.json()
      setUsers(json)
      console.log('Users have been successfully fetched');
    }
    fetchUsers();
  }, [])

  const getTargetUserHabits = async (targetUserId) => {
    const habits = await getTargetHabits(targetUserId)
    setTargetHabits(habits)
  }

  const linkHabit = async (originalHabitId, originalUserId) => {
    console.log(originalHabitId)
    console.log(originalUserId)
    const success = await syncHabit(originalHabitId, originalUserId, 1)
    if (!success) {
      console.log('failed')
    }
    //make hook
  }

  return (
    <>
      <Navigation></Navigation>
      <div className = 'users'>
        { targetHabits.length > 0 && <h3> User habits: </h3> }
        { targetHabits.length > 0 && targetHabits.map((habit) => (
          <pre key = { habit._id }>
            {JSON.stringify(habit, null, 2)}
            <br></br>
            <button onClick = {() => {linkHabit(habit._id, habit.userId)}}>Sync Habit</button>
          </pre>
        ))}

        <h3> All users: </h3>
        { users && users.map((user) => (
          <pre key= { user._id }>
            {JSON.stringify(user, null, 2)}
            <br></br>
            <button onClick = {() => getTargetUserHabits(user._id)}>Display { user.username } habits </button>
          </pre>
        ))}
      </div>
    </>
  )
}
export default Users
