import { useEffect, useState } from 'react'
import { CreateHabitForm } from '../components/CreateHabitForm'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext'
import { Habit } from '../components/Habit'
import { Navigation } from '../components/Navigation'
import { AdvancedHabit } from '../components/AdvancedHabit'

const Habits = () => {

  const { habits, friendHabits, publicHabits } = useHabitsContext()
  const { getHabits, getPublicHabits, getFriendHabits } = useHabits()
  const { user } = useAuthContext()
  const [selectedHabit, setSelectedHabit] = useState(null)

  
  
  const isUsersHabit = (habit) => {
    return user?._id?.toString() === habit?.userId?.toString();
  }

  const selectHabit = (habit) => {
    if (!isUsersHabit(habit)) {
      return 
    }
    setSelectedHabit(habit)
  }

  useEffect(() => {

    getHabits()
    getPublicHabits()
    getFriendHabits()

  }, [user])

  return (
    <>
      <Navigation></Navigation>
      <div className="habits">
        {habits?.length > 0 && selectedHabit && <AdvancedHabit habit={selectedHabit} />}
        <div className = "user-habits">
          <h1> Your Habits </h1> 
          <div className = "underline"></div>

          { habits && habits.length > 0 ? (
            habits.map(habit => (
              <Habit 
                onClick = {() => selectHabit(habit)} 
                key = {habit._id} 
                habit = {habit} 
              />
            ))
          ) : (
            <p>No Habits found</p>
          )}
        </div>
        
        {/* <div className="friend-habits">
          <h1>Friend Habits</h1>
          <div className="underline"></div>
          {friendHabits && friendHabits.length > 0 ? (
            friendHabits.map(friendHabit => (
              <Habit 
                key={friendHabit._id} 
                habit={friendHabit} 
              />
            ))
          ) : (
            <p>No Friend Habits found</p>
          )}
        </div>

        <div className="public-habits">
          <h1>Public Habits</h1>
          <div className="underline"></div>
          {publicHabits && publicHabits.length > 0 ? (
            publicHabits.map(publicHabit => (
              !isUsersHabit(publicHabit) ? (
                <Habit 
                  key={publicHabit._id} 
                  habit={publicHabit} 
                />
              ) : null
            ))
          ) : (
            <p>No public habits found</p>
          )}
        </div> */}
        
      </div>
      <div className="create">
      </div>
      <CreateHabitForm></CreateHabitForm>
    </>
  )
}
export default Habits