import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'

const Friends = () => {
  
  const [users, setUsers] = useState([])
  const { getTargetHabits } = useHabits()
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


  return (
    <div className = 'users'>
      
      { targetHabits && <h3> User habits: </h3> }
      { targetHabits && targetHabits.map((habit) => (
        <pre key = { habit._id }>
          {JSON.stringify(habit, null, 2)}
        </pre>
      ))}

      <h3> All users: </h3>
      { users && users.map((user) => (
        <pre key= { user._id }>
          {JSON.stringify(user, null, 2)}
          <button onClick = {() => getTargetUserHabits(user._id)}> Show Habits! </button>
        </pre>
      ))}
    </div>
  )
}
export default Friends
