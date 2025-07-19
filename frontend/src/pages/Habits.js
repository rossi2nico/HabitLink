import { useEffect } from 'react'
import { CreateHabitForm } from '../components/CreateHabitForm'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext'
import { Habit } from '../components/Habit'
import { Navigation } from '../components/Navigation'

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
        <div className = "user-habits">
          <h3> Habits </h3>

          { habits && (habits.length > 0) ? (
            habits.map(habit => <Habit key = { habit._id} habit = { habit }></Habit>
          )) : (
            <p>No Habits found</p>
          )}
        </div>
        
        <div className = "friend-habits">
          <h3> Friend Habits </h3>
          { friendHabits && (friendHabits.length > 0) ? (
            friendHabits.map(friendHabit => <Habit key = { friendHabit._id} habit = { friendHabit }></Habit>
          )) : (
            <p> No Friends Habits found</p>
          )}
          <div className = "public-habits">
            <h3> Public Habits </h3>
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