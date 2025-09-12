import { useHabits } from "../hooks/useHabits"
import { useState, useEffect } from 'react'
import { Calendar2 } from "./Calendar2"
import { useParams } from 'react-router-dom'
import { Navigation } from "./Navigation"
import { useHabitsContext } from "../hooks/useHabitsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import sync from '../assets/sync4.png'
import { UserCard } from "./UserCard"
import { format } from "date-fns"
import { MasteryGraph } from "./MasteryGraph"

export const AdvancedHabit = () => {

  const { habits } = useHabitsContext()
  const { getLinkedHabits, getHabit2 } = useHabits()
  const [syncedHabits, setSyncedHabits] = useState([])
  const [habit, setHabit] = useState(null)
  const [error, setError] = useState("")
  const [syncedError, setSyncedError] = useState("")
  const { user } = useAuthContext()
  const { habitId } = useParams()  
  const currentDate = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!user) {
      return
    }
    /* We will only find the habit in context if we previously clicked from the habits page with the context. */
    const habitFromContext = habits.find(h => h._id === habitId)
    if (habitFromContext) {
      setHabit(habitFromContext)
    }
    /* This should fetch the habit and update habits context */
    else {
      const fetchHabit = async () => {
        try {
          const res = await getHabit2(habitId, currentDate)
          console.log("fetched advanced habit: ", res)
          if (res.success == true) {
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
        if (res.success == false) {
          setSyncedError(res.error)
        }
        else {
          const sortedResult = [...(res.syncedHabits || [])].sort((a, b) => {
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

  if (!habit) {
    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Navigation></Navigation>
        <h1 style={{marginTop:'250px'}}>Loading advanced habit data ...</h1>
      </div>
    )
  } 

  const rawPercentCompleted = habit.totalCompletions / habit.potentialCompletions * 100;
  const percentCompleted = parseFloat(rawPercentCompleted.toFixed(1));

  return (
    <div className="advanced-habit">
      <Navigation></Navigation>
      <div className = "advanced-habit-info">
        <h1 style = {{textAlign:'center', fontWeight: '700', marginTop: '-5px'}}> { habit.name } <p style = {{textAlign:'center', marginBottom:'-5px'}}> 
          {habit.privacy === 0
            ? "Private Habit"
            : habit.privacy === 1
            ? "Friends-only Habit"
            : "Public Habit"}
        </p></h1>
        { habit.description && habit.description != "" && (
          <h3 style = {{color:"#afafafff", marginTop:"-5px"}}> { habit.description } </h3>
        )}
          <p>
            {habit.streak === habit.maxStreak
              ? <>🔥 Current streak: {habit.streak} days <br/>  🏹 Currently on Longest streak!</>
              : <>🔥 Current streak: {habit.streak} days <br/> 🏹 Longest streak: {habit.maxStreak} days</>}
          </p>
          <p> Completed { habit.totalCompletions } out of { habit.potentialCompletions} total days!
            <br/>
            🚀 Overall { percentCompleted }% completion!
          </p>
        {/* </div> */}
        {/* <div className = "underline"></div> */}

      </div>
      <div className = "synced-stats" style = {{marginTop: "50px"}}>

        <div className = "completion-graph">
          <h3> Habit Mastery</h3>
          <div style = {{marginTop:"30px", height:"300px", width:"300px", backgroundColor:"transparent"}}>
            <MasteryGraph habit = { habit }/>
          </div>
        </div>
        
        <div className = "synced-users">
          <h3 style = {{marginBottom:'-10px', fontWeight:'600'}}> Linked Users </h3>
          { syncedHabits && syncedHabits.length == 1 ? (
          <p>
            <img style = {{marginBottom:'-2px', width:'15px', marginRight:'5px'}}src = { sync } ></img> 
            There is { syncedHabits.length } synced user</p>
        ) : (
          <p>
            <img style = {{marginBottom:'-2px', width:'15px', marginRight:'5px'}}src = { sync } ></img>  
            There are { syncedHabits.length } synced users</p>
        )}
            
          {syncedHabits?.map((h) => (
            // <li key={h._id} style = {{padding:"5px", fontSize:"15px"}}>{ h.username } has a  { h.habitId.streak } day streak </li>
            <UserCard habit = { h }></UserCard>
          ))}
        </div>

        <div className = "calendar-container">
          {/* <h3> Calendar </h3> */}
          <Calendar2 habit = {habit}></Calendar2>

        </div>
        
        {/* <div className = "completion-graph">
          <h3> Habit Mastery.</h3>

          <HabitMastery habit = { habit }/>
        </div> */}
        {/* <div className = "completion-graph">
          <h3> Habit Completion</h3>
          <BarGraphDaily habit = { habit }></BarGraphDaily>
        </div> */}
      </div>
    </div>
  )
}
