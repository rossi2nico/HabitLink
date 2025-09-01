import { Navigation } from "../components/Navigation"
import { LineGraphHabits } from "../components/LineGraphHabits"
import { useHabits } from "../hooks/useHabits"
import { useHabitsContext } from "../hooks/useHabitsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useEffect } from "react"
import { useFriends } from "../hooks/useFriends"
import { Habit } from "../components/Habit"
import github from '../assets/github.png'
import { Calendar } from "../components/Calendar"
import create from '../assets/create.png'
import { useNavigate } from 'react-router-dom'


const Habits = () => {

  const { user } = useAuthContext()
  const { habits, friendHabits, publicHabits } = useHabitsContext()
  const { getHabits, getPublicHabits, getFriendHabits } = useHabits()
  const { getFriends } = useFriends();
  const navigate = useNavigate();

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
        <Navigation></Navigation>
        <div className = "home">
          <div className = "hero">
            <div className = "intro">
              <h3>HabitLink 
                <img className = "github-logo" src = { github } />
              </h3>
              <p> Community based habit tracker designed to promote accountability and consistency between users.</p>
              <p>Connect with friends, track your progress, and stay motivated as you develop positive habits together :)</p>
            </div>
            <div className = "habits-graph-div">
              <h3>Habit Completions (%)</h3>
              <LineGraphHabits habits = { habits }></LineGraphHabits>
            </div>
          </div>
          <div className = "home-mid">
            <div className = "home-habits">
              <h2>Your Habits
                <img className = 'create-habit-icon' 
                src = { create }
                onClick={() => navigate('/habits/create')}
                ></img>
              </h2>
              <h5>Click on any habit to view advanced statistics</h5>
              {habits.map(habit => (
                <Habit 
                  key = {habit._id} 
                  habit = {habit} 
                />
              ))}
            </div>
            {/* <div className = "home-calendar">
              {habits && habits.length > 0 && (
                <>
                  <Calendar habit = { habits[0] }></Calendar>
                </>
            )}
            </div> */}
          </div>
        </div>
      </>
    )
  }

export default Habits