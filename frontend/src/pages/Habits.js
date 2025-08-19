import { useEffect, useState } from 'react'
import { CreateHabitForm } from '../components/CreateHabitForm'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext'
import { Habit } from '../components/Habit'
import { Navigation } from '../components/Navigation'
import { AdvancedHabit } from '../components/AdvancedHabit'
import { Link } from "react-router-dom"

const Habits = () => {

  const { habits, friendHabits, publicHabits } = useHabitsContext()
  const { getHabits, getPublicHabits, getFriendHabits } = useHabits()
  const { user } = useAuthContext()
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [activeView, setActiveView] = useState(0)

  const isUsersHabit = (habit) => {
    return user?._id?.toString() === habit?.userId?.toString();
  }

  const changeActiveLeft = () => {
    setSelectedHabit(null)
    if (activeView == 0) setActiveView(2);
    else setActiveView(activeView - 1)
  }

  const changeActiveRight = () => {
    setSelectedHabit(null)
    if (activeView == 2) setActiveView(0);
    else setActiveView(activeView + 1);
    
  }

  const selectHabit = (habit) => {
    if (!isUsersHabit(habit)) {
      return 
    }
    <Link to = "\stats"></Link>
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
      <div className="habits-page">
        <div className = "habit-categories">
          <button onClick = {changeActiveLeft}>left</button>
          <div>
            {activeView === 0 ? (
              <h1>Your Habits</h1>
            ) : activeView === 1 ? (
              <h1>Friend Habits</h1>
            ) : activeView === 2 ? (
              <h1>Public Habits</h1>
            ) : null}
            
          </div>
          
          <button onClick = {changeActiveRight}> right </button>
        </div>

        <div className="habits">

          {/* {habits?.length > 0 && selectedHabit && <AdvancedHabit habit={selectedHabit} />} */}
          {activeView == 0 && <div className = "user-habits">
            <div style = {{marginTop:"-30px"}} className = "underline"></div>

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
          </div>}

          {activeView == 1 && <div className="friend-habits">
            <div style = {{marginTop:"-30px"}} className="underline"></div>
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
          </div>}

          {activeView == 2 && <div className="public-habits">
            <div style = {{marginTop:"-30px"}} className="underline"></div>
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
          </div>}
            
        </div>
      </div>
      <CreateHabitForm></CreateHabitForm>
    </>
  )
}
export default Habits