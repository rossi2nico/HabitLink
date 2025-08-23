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
          <button onClick = {changeActiveLeft}>&lt;</button>
          <div>
            {activeView === 0 ? (
              <h1>Your Habits</h1>
            ) : activeView === 1 ? (
              <h1>Friend Habits</h1>
            ) : activeView === 2 ? (
              <h1>Public Habits</h1>
            ) : null}
            
          </div>
      
          <button onClick = {changeActiveRight}> &gt; </button>
        </div>
        
        <div style={{margin: '-10px auto 0', width: '360px' }} className="underline"></div>


        <div className="habits">
          {activeView == 0 && 
          <>
            <div className = "user-create">
              {/* <CreateHabitForm></CreateHabitForm>  */}
              
            </div>
            <div className = "user-habits">
              
              { habits && habits.length > 0 ? (
                habits.map(habit => (
                  <Habit 
                    onClick = {() => selectHabit(habit)} 
                    key = {habit._id} 
                    habit = {habit} 
                  />
                ))
              ) : (
                <p>
                  No habits found...<br />
                  <span 
                    style={{ fontWeight: 'bold', color: 'rgba(129, 240, 221, 1)', cursor: 'pointer' }} 
                    onClick={() => console.log('Navigate to create habit')}>
                      Create your first habit
                  </span> or sync with another user!
                </p>
              )}
              { habits && habits.length > 0 && (
                  <p style = {{marginTop:'60px', marginBottom:'-15px'}}>You have { habits.length } habits!</p>
              )}
              { habits && habits.length > 0 && (
                  <p>Click on any habit to view advanced statistics!</p>
              )}
              <button className = "create-habit-button">Create new habit</button>
              {/* <CreateHabitForm></CreateHabitForm> */}

            </div>
          </>
          }

          {activeView == 1 && <div className="friend-habits">
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
    </>
  )
}
export default Habits