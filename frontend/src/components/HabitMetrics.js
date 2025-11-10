import { useHabits } from "../hooks/useHabits"
import { useState, useEffect } from 'react'
import { Calendar } from "./Calendar"
import { useParams } from 'react-router-dom'
import { Navigation } from "./Navigation"
import { useHabitsContext } from "../hooks/useHabitsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import sync from '../assets/sync4.png'
import { format } from "date-fns"
import { MasteryGraph } from "./MasteryGraph"
import dropdown from '../assets/dropdown-white.png'
import { useNavigate } from "react-router-dom"

export const HabitMetrics = () => {

  const { habits } = useHabitsContext()
  const { getLinkedHabits, getHabit, getHabits } = useHabits()
  const [syncedHabits, setSyncedHabits] = useState([])
  const [refreshHabits, setRefreshHabits] = useState([])
  const [habit, setHabit] = useState(null)
  const [error, setError] = useState("")
  const [syncedError, setSyncedError] = useState("")
  const { user } = useAuthContext()
  const { habitId } = useParams()  
  const navigate = useNavigate();
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!user) {
      return
    }
    /* If habits aren't loaded from context (refreshing page on itself edge case)*/
    if (habits.length === 0) {
      const fetchHabits = async () => {
        const res = await getHabits();
        setRefreshHabits(res.habits);
      }
      fetchHabits();
    }
    /* This will only find the habit in context if we previously clicked from the habits page with the context. */
    const habitFromContext = habits.find(h => h._id === habitId)
    if (habitFromContext) {
      setHabit(habitFromContext)
    }
    /* This should fetch the habit and update habits context */
    else {
      const fetchHabit = async () => {
        try {
          const res = await getHabit(habitId, currentDate)
          if (res.success === true) {
            setHabit(res.habit)
          } else {
            setError(res.error)
          }
        } catch (err) {
          setError(err.message || String(err))
        }
      }
      fetchHabit()
    }

  }, [habitId, habits, user])

  useEffect(() => {
    if (!habit) return

    const fetchSynced = async () => {
      try {
        const res = await getLinkedHabits(habit._id)
        if (res.success === false) {
          setSyncedError(res.error);
          console.log(syncedError);
        }
        else {
          const sortedResult = [...(res.linkedHabits || [])].sort((a, b) => {
          const streakA = a.habitId?.streak ?? a.streak ?? 0
          const streakB = b.habitId?.streak ?? b.streak ?? 0
          return streakB - streakA
          })
        setSyncedHabits(sortedResult)        
        }
      } catch (error) {
        console.error(error.message)
      }
    }
    fetchSynced()
  }, [habit])

  if (error) {
    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Navigation></Navigation> 
        <h1 style={{marginTop:'250px'}}>{error}</h1>
      </div>
    )
  }

  let index, prevIndex, nextIndex, prevHabitId, nextHabitId;
  if (refreshHabits.length > 0) {
    /* Solves refresh issue by loading content from fetched habits instead of using context*/
    index = refreshHabits.findIndex((h) => h === habit);

    prevIndex = (index - 1 + habits.length) % habits.length;
    nextIndex = (index + 1) % habits.length;

    nextHabitId = refreshHabits[nextIndex]?._id;
    prevHabitId = refreshHabits[prevIndex]?._id;
  } else {
    index = habits.findIndex((h) => h === habit);

    prevIndex = (index - 1 + habits.length) % habits.length;
    nextIndex = (index + 1) % habits.length;
    
    nextHabitId = habits[nextIndex]?._id;
    prevHabitId = habits[prevIndex]?._id;
  }

  const navigatePrev = () => {
    if (index === prevIndex) return;
    navigate(`/habits/${ prevHabitId }`)
  }

  const navigateNext = () => {
    if (index === nextIndex) return;
    navigate(`/habits/${ nextHabitId }`)
  }

  if (!habit) {
    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Navigation></Navigation>
        <h1 style={{marginTop:'250px'}}>Loading advanced habit data ...</h1>
      </div>
    )
  } 

  // const rawPercentCompleted = habit.totalCompletions / habit.potentialCompletions * 100;
  // const percentCompleted = parseFloat(rawPercentCompleted.toFixed(1));

  return (
    <>
      <Navigation></Navigation>
      <section className="details-section">
        <div className = "details-header">
            <h1> {habit.name} </h1>
            <div className = "navigate-advanced">
              <button onClick = { navigatePrev }> Prev </button> 
              <button onClick = { navigateNext }> Next </button>
            </div>
          </div>
          <h5> I am going to make it. { habit.description } </h5>
        <div className="habit-details">

          <button><img style={{ margin: '0', width: '20px' }} src={dropdown}></img>{ habit.privacy === 0 ? "Private"
          : habit.privacy === 1 ? "Friends" : "Public" }</button>
          <button><img style={{ margin: '0', width: '20px' }} src={dropdown}></img>{ habit.startDate }</button>
          {/* <button className = "fill" style = {{ maxWidth: '80px' }}>Share</button> */}
          {/* <button>Delete</button> */}
          {/* <button>edit</button> */}
          <button className = "fill" style = {{ justifyContent: 'left', gap: '25px', maxWidth: '120px', width: '25%' }}> <img style = {{ width: '17px'}} src = { sync }></img>{ (habit.linkedHabits?.length || "No") } users</button>

            <button>Habit settings</button>
        </div>

        {/* {<div className = "fill2" style={{ height: '34px', width: '100%', display: 'flex', gap: '10px' }}> */}
            {/* Implement this tomorrow */}
            {/* <button className = "fill" style = {{ justifyContent: 'left', gap: '10px' }}> <img style = {{ width: '17px'}} src = { sync }></img>{ (habit.linkedHabits?.length || "No") } Linked Users</button> */}
          {/* </div>} */}
      </section>
      <main className = "habit-data">        
        <section className = "mastery">
          <h1> Habit Mastery</h1>
          <h5>Blah blah Bllah blah Bllah blah Blah Blah</h5>
          <div className="mastery-graph">
            <MasteryGraph habit={habit} />
          </div>
        </section>

        <section className = "calendar-section">
          <h1> Completion Calendar </h1>
          <h5>Blah blah Bllah blah Bllah blah Blah Blah</h5>
          <div className="calendar-container">
            <Calendar habit={habit}></Calendar>
          </div>
        </section>

        {/* <section className = "mastery">
          <h1 className="synced-users-title">Linked Users</h1>
          <h5>Salam Alaikum</h5>
          {syncedHabits && (
            <p className="synced-users-count">
              <img src={sync} alt="sync icon" style={{ marginBottom: '-1pt', width: '16px', marginRight: '5px' }} />
              {syncedHabits.length === 1
                ? `There is ${syncedHabits.length} synced user`
                : `There are ${syncedHabits.length} synced users`}
            </p>
          )}

          {syncedHabits?.map((h) => (
            <UserCard key={h._id} habit={h} />
          ))}
        </section> */}

        {/* <section className = "mastery">
          <h1>Coming SOon</h1>
          <h5>SUiiiiiiiiiii</h5>
        </section> */}
      
        {/* <div className="idk" >
          <div className="advanced-stats">
            <p>{habit.streak}</p>
            <h4>STREAK</h4>
          </div>
          <div className="advanced-stats">
            <p>{habit.maxStreak}</p>
            <h4>MAX STREAK</h4>
          </div>
          <div className="advanced-stats">
            <p>{syncedHabits.length}</p>
            <h4>LINKED USERS</h4>
          </div>
          <div className="advanced-stats">
            <p> 79%</p>
            <h4>COMPLETION (%)</h4>
          </div>
          <div className="advanced-stats">
            <p style={{ fontSize: "16px", marginTop: '7px', fontWeight: "600", fontFamily: "Manrope" }}> Novice </p>
            <h4>HABIT MASTERY</h4>
          </div>
        </div> */}

        {/* <section className = "habit-details">
          <h1>test</h1>
        </section> */}
      </main>
    </>
  )

  // return (
  //   <div className="advanced-habit">
  //     <Navigation></Navigation>
      
  //     <div className = "synced-stats" style = {{marginTop: "50px"}}>
  //       <div className = "completion-graph">
  //         <h3> Habit Mastery</h3>
  //         <div style = {{marginTop:"30px", height:"320px", width:"320px", backgroundColor:"transparent"}}>
  //           <MasteryGraph habit = { habit }/>
  //         </div>
  //       </div>

  //       <div className = "calendar-container">
  //         {/* <h1> Calendar </h1> */}
  //         <Calendar habit = {habit}></Calendar>
  //       </div>

  //       <div className = "synced-users">
  //         <h3 style = {{marginBottom:'-10px', fontWeight:'600'}}> Linked Users </h3>
  //         { syncedHabits && syncedHabits.length == 1 ? (
  //         <p>
  //           <img style = {{marginBottom:'-2px', width:'15px', marginRight:'5px'}}src = { sync } ></img> 
  //           There is { syncedHabits.length } synced user</p>
  //       ) : (
  //         <p>
  //           <img style = {{marginBottom:'-2px', width:'15px', marginRight:'5px'}}src = { sync } ></img>  
  //           There are { syncedHabits.length } synced users</p>
  //       )}
            
  //         {syncedHabits?.map((h) => (
  //           // <li key={h._id} style = {{padding:"5px", fontSize:"15px"}}>{ h.username } has a  { h.habitId.streak } day streak </li>
  //           <UserCard key = { h._id } habit = { h }></UserCard>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // )
}
