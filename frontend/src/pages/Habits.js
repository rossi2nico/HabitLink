import { Navigation } from "../components/Navigation"
import { HabitsGraph } from "../components/HabitsGraph"
import { useHabits } from "../hooks/useHabits"
import { useHabitsContext } from "../hooks/useHabitsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useEffect } from "react"
import { useFriends } from "../hooks/useFriends"
import { Habit } from "../components/Habit"
import github from '../assets/github.png'
import create from '../assets/create.png'
import { useNavigate } from 'react-router-dom'


const Habits = () => {

  const { user } = useAuthContext()
  const { habits } = useHabitsContext()
  const { getHabits } = useHabits()
  const { getFriends } = useFriends();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return
    }
    getFriends(user._id);
    getHabits()
  }, [user])

  let linkedUsers = 0, totalCompletions = 0, maxStreak = 0;
  for (const habit of habits) {
    if (habit.maxStreak > maxStreak) maxStreak = habit.maxStreak;
    console.log("habit before fail:", habit)
    linkedUsers += habit.linkedHabits?.length || 0;
    totalCompletions += 2
  }

    return (
      <>
        <Navigation></Navigation>
        <div className = "home">
          <div className = "idk">
            <div className = "advanced-stats">
              <p> { habits.length }</p>
              <h4>HABITS</h4>
            </div>
            <div className = "advanced-stats">
              <p> { maxStreak }</p>
              <h4>MAX STREAK</h4>
            </div>
            <div className = "advanced-stats">
              <p> { linkedUsers } </p>
              <h4> LINKED USERS</h4>
            </div>
            <div className = "advanced-stats">
              <p> 79%</p>
              <h4> AVERAGE COMPLETION (%)</h4>
            </div>
            <div className = "advanced-stats">
              <p> 193 </p>
              <h4>TOTAL COMPLETIONS</h4>
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
            <div className = "habits-graph-div">
                <h3 style = {{marginBottom:'30px'}}>Habit Completions Over Time (%)</h3>
                <HabitsGraph habits = { habits }></HabitsGraph>
              </div>
          </div>          
          
        </div>
      </>
    )
  }

export default Habits