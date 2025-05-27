import { useState, useEffect } from 'react'

const Friends = () => {
  
  const [users, setUsers] = useState([])
  useEffect(() => { 
    const fetchUsers = async () => {
      const res = await fetch ('/api/users/')
      const json = await res.json()
      setUsers(json)
      console.log('Users have been successfully fetched');
    }
    fetchUsers();
  }, [])
  return (
    <div className = 'users'>
      {users && users.map((user) => (
        <pre key={user._id}>
          {JSON.stringify(user, null, 2)}
        </pre>
      ))}
    </div>
  )
}
export default Friends
