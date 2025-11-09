import { Navigation } from "../components/Navigation"
import { HabitsGraph } from "../components/HabitsGraph"
import { useHabits } from "../hooks/useHabits"
import { useHabitsContext } from "../hooks/useHabitsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useEffect, useState } from "react"
import { useFriends } from "../hooks/useFriends"
import { Habit } from "../components/Habit"
import { Footer } from '../components/Footer'
import create from '../assets/create.png'
import { useNavigate } from 'react-router-dom'
import dropdown from '../assets/dropdown-white.png'

const Habits = () => {
  const { user } = useAuthContext()
  let { habits } = useHabitsContext()
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

  const [filterSelected, setFilterSelected] = useState(false);
  const [sortSelected, setSortSelected] = useState(false);

  const sortStreak = () => {
    habits = habits.sort((a, b) => b.streak - a.streak);
    setSortSelected(false);
  };

  const sortNewest = () => {
    habits = habits.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    setSortSelected(false);
  };

  const sortOldest = () => {
    habits = habits.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    setSortSelected(false);
  };

  const sortUsers = () => {
    habits = habits.sort((a, b) => (b.linkedHabits?.length || 0) - (a.linkedHabits?.length || 0));
    setSortSelected(false);
  }

  // if (habits.length == 0) {
  //   return (
  //     <>
  //       <Navigation></Navigation>
  //       <home className = "home-mid">
  //         <div className = "welcome">
  //           <h1><span>Create or link</span> a habit to begin your journey!</h1>
  //           <p>“The journey of a thousand miles begins with a single step.” --<span style = {{ color: "#dbdbdbff", margin: 0, fontSize: '13px'}}> Lao Tzu</span></p>
  //           <button onClick = { () => navigate('/habits/create') }>Create new habit</button>
  //         </div>
  //       </home>
  //     </>
  //   )
  // }

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
              <button className={sortSelected ? "highlighted" : ""} 
                onMouseEnter={() => setSortSelected(true)}
                onMouseLeave={() => setSortSelected(false)}>
                <img style={{ margin: '0', width: '20px' }} src={dropdown}></img>Sort</button>
              <button className = { filterSelected ? "highlighted" : "" }
                onMouseEnter={() => setFilterSelected(true)}
                onMouseLeave={() => setFilterSelected(false)}
                ><img style={{ margin: '0', width: '20px' }} src={dropdown}></img>Filter</button>
              {/* <button style = {{justifyContent: 'center'}}>Re-order </button> */}
              <button onClick = {() => navigate('/habits/create')}>New Habit</button>
            </div>

            { sortSelected ? 
              <div className="filter-options"
              onMouseEnter={() => setSortSelected(true)}
                onMouseLeave={() => setSortSelected(false)}>
                <button onClick= { sortStreak } className="dropdown">Streak</button>
                <button onClick= { sortUsers } className="dropdown">Users</button>
                <button onClick= { sortNewest } className="dropdown">Newest</button>
                <button onClick= { sortOldest} className="dropdown">Oldest</button>
              </div> : null }

            {filterSelected ?
              <div className="filter-options"
                onMouseEnter={() => setFilterSelected(true)}
                onMouseLeave={() => setFilterSelected(false)}>
                <button className = "dropdown">Public</button>
                <button className="dropdown">Synced</button>
                <button className="dropdown">Bundled</button>
                <button className="dropdown">TBD</button> 
                <button className="dropdown">TBD</button> 
              </div> : null}

              {!filterSelected && !sortSelected && 
                <div style = {{height:'34px', width: '100%', display: 'flex', gap: '10px'}}>
                  {/* Implement this tomorrow */}
                <p className="fill">No synced habits</p> 
                {/* <p className="fill">27 max streak</p>    */}
                </div>}


            {habits.length > 0 ? 
              habits.map(habit => (
              <Habit key={habit._id} habit={habit} />
            )) : 
              <div className="welcome">
                <h1><span>Create or link</span> a habit to begin your journey!</h1>
              < p>“The journey of a thousand miles begins with a single step.” -<span style = {{ color: "#dbdbdbff", margin: 0, fontSize: '13px'}}> Lao Tzu</span></p>
              < button onClick = { () => navigate('/habits/create') }>Create new habit</button>
              </div>
            }
          </section>

          {/* Graph Section */}
          <div className="graph-more">
            {/* <h2>Habit Completion </h2> */}
            {/* <h5>Completion over time for all habits (%)</h5> */}

            <div className="graph-filters">
              <button style={{ justifyContent: 'center' }} >30 days</button>
              <button style={{ justifyContent: 'center' }} >3 months</button>
            </div>

            <div className="habits-graph-div">
              <HabitsGraph habits={habits} />
            </div>
            <h5>Habit completions over time (%)</h5>

          </div>
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