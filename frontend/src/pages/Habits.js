import { Navigation } from "../components/Navigation"
import { HabitsGraph } from "../components/HabitsGraph"
import { useHabits } from "../hooks/useHabits"
import { useHabitsContext } from "../hooks/useHabitsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useEffect } from "react"
import { useFriends } from "../hooks/useFriends"
import { Habit } from "../components/Habit"
import { Footer } from '../components/Footer'
import create from '../assets/create.png'
import { useNavigate } from 'react-router-dom'
import dropdown from '../assets/dropdown-white.png'

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
    linkedUsers += habit.linkedHabits?.length || 0;
    totalCompletions += 2
  }

  if (habits.length == 0) {
    return (
      <>
        <Navigation></Navigation>
        <home className = "home-mid">
          <div className = "welcome">
            <h1><span>Create or link</span> a habit to begin your journey!</h1>
            <p>“The journey of a thousand miles begins with a single step.” --<span style = {{ color: "#dbdbdbff", margin: 0, fontSize: '13px'}}> Lao Tzu</span></p>
            <button onClick = { () => navigate('/habits/create') }>Create new habit</button>
          </div>
        </home>
      </>
    )
  }

  return (
    <>
      <Navigation />

      <div className="home">
        <div className="home-mid">
          {/* Active Habits Section */}
          <section className="home-habits">
            <h2> Active Habits </h2>
            <h5>Click on any habit to view advanced statistics</h5>
            
            <div className = "habits-filters">
              <button><img style={{ margin: '0', width: '20px' }} src={dropdown}></img>Filter</button>
              <button><img style={{ margin: '0', width: '20px' }} src={dropdown}></img>Sort</button>
              <button><img style={{ margin: '0', width: '20px' }} src={dropdown}></img>Reorder</button>
              <button onClick = {() => navigate('/habits/create')}>New Habit</button>
            </div>

            {habits.map(habit => (
              <Habit key={habit._id} habit={habit} />
            ))}
          </section>

          {/* Graph Section */}
          <section className="graph-more">
            <h2 style={{fontSize: '30px', margin: 0, color: '#fff', fontWeight: 650}}>
              Habit Progress
            </h2>
            <h5>Completion over time for all habits (%)</h5>

            <div className="habits-graph-div">
              <HabitsGraph habits={habits} />
            </div>
          </section>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  )
}

export default Habits

{/* <div className = "idk">
            <p> turn this into a scrollable array</p>
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
          </div> */}