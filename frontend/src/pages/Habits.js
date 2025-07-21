import { useEffect } from 'react'
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
  
  const isUsersHabit = (habit) => {
    return user?._id?.toString() === habit?.userId?.toString();
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
        {habits?.length > 0 && <AdvancedHabit habit={habits[1]} />}
        <div className = "user-habits">
          <h1> Habits </h1>

          { habits && (habits.length > 0) ? (
            habits.map(habit => <Habit key = { habit._id} habit = { habit }></Habit>
          )) : (
            <p>No Habits found</p>
          )}
        </div>
        
        <div className = "friend-habits">
          <h1> Friend Habits </h1>
          { friendHabits && (friendHabits.length > 0) ? (
            friendHabits.map(friendHabit => <Habit key = { friendHabit._id} habit = { friendHabit }></Habit>
          )) : (
            <p> No Friends Habits found</p>
          )}
          <div className = "public-habits">
            <h1> Public Habits </h1>
              { publicHabits && publicHabits.length > 0 ? publicHabits.map((publicHabit) => (
                !isUsersHabit(publicHabit) ? (
                  <Habit key = { publicHabit._id } habit = { publicHabit }></Habit>
                ) : null
              )) : (
              <p>No public habits found</p>
            )}
          </div>
        </div>
        
      </div>
      <div className="create">
      </div>
      <CreateHabitForm></CreateHabitForm>
    </>
  )
}
export default Habits