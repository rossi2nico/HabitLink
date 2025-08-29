import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHabitsContext } from '../hooks/useHabitsContext'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext'
import { Habit } from '../components/Habit'
import { Navigation } from '../components/Navigation'
import { AdvancedHabit } from '../components/AdvancedHabit'
import { useFriends } from '../hooks/useFriends'
import { useFriendsContext } from '../hooks/useFriendsContext'

const Habits = () => {

  const { habits, friendHabits, publicHabits } = useHabitsContext()
  const { getHabits, getPublicHabits, getFriendHabits } = useHabits()
  const { friends, pendingUsers } = useFriendsContext();
  const { getFriends } = useFriends();
  const { user } = useAuthContext()
  const [selectedHabit, setSelectedHabit] = useState(null)
  const [activeView, setActiveView] = useState(0)
  const navigate = useNavigate();

  const isUsersHabit = (habit) => {
    return user?._id?.toString() === habit?.userId?.toString();
  } 

  const changeActiveLeft = () => {
    setSelectedHabit(null)
    if (activeView === 0) setActiveView(2);
    else setActiveView(activeView - 1)
  }

  const changeActiveRight = () => {
    setSelectedHabit(null)
    if (activeView === 2) setActiveView(0);
    else setActiveView(activeView + 1);
  }

  const selectHabit = (habit) => {
    if (!isUsersHabit(habit)) {
      return 
    }
    setSelectedHabit(habit)
  }

  useEffect(() => {
    if (!user) {
      return
    }
    getFriends(user._id);
    getHabits()
    getPublicHabits()
    getFriendHabits()
  }, [user])

  return (
    <>
      <Navigation />
      <div className="habits-page">
        <div className="habit-categories">
          <button style = {{marginTop:'-4px'}} onClick={changeActiveLeft}>&lt;</button>
          <div>
            {activeView === 0 ? (
              <p>Habits</p>
            ) : activeView === 1 ? (
              <p>Friend Habits</p>
            ) : activeView === 2 ? (
              <p>Public Habits</p>
            ) : null}
          </div>
          <button style = {{marginTop:'-3px'}} onClick={changeActiveRight}>&gt;</button>
        </div>
        
        {/* <div style={{margin: '-20px auto 0', width: '0px'}} className="underline"></div> */}

        <div className="habits">
          {activeView === 0 && 
                <div className="user-habits">
                  {habits && habits.length > 0 ? (
                    habits.map(habit => (
                      <Habit 
                        onClick={() => selectHabit(habit)} 
                        key={habit._id} 
                        habit={habit} 
                      />
                    ))
                  ) : (
                    <p>
                      No habits found...<br />
                      Create your own habit or sync with another users habit!
                    </p>
                  )}
                  
                  {/* {habits && habits.length > 0 && (
                    <p style={{marginTop: '25px', marginBottom: '-15px'}}>
                      You have {habits.length} active habits!
                    </p>
                  )} */}

                  <div style = {{ marginTop:'30px', width: '250px'}}className = "underline"></div>

                  <button 
                    style = {{ marginTop: '10px' }}
                    onClick={() => navigate('/habits/create')}
                    className="create-habit-button"
                  >
                    Create new habit
                  </button>
                  {habits && habits.length > 0 && (
                    <p style={{marginTop: '17px'}}>
                      Click on any habit to view advanced statistics!
                    </p>
                  )}
                  
                  
                </div>              
          }

          {activeView === 1 && (
            <div className="friend-habits">
              {friends && friends.length === 0 && (
                <p>No friends found</p>
              )}
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
          )}

          {activeView === 2 && (
            <div className="public-habits">
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
            </div>
          )}
        </div>

        {selectedHabit && (
          <div className="advanced-habit-container">
            <AdvancedHabit habit={selectedHabit} />
            <button onClick={() => setSelectedHabit(null)}>
              Back to Habits
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Habits