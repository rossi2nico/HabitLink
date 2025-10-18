import { useHabits } from "../hooks/useHabits"
import { useState, useEffect } from 'react'
import { Calendar } from "./Calendar"
import { useParams } from 'react-router-dom'
import { Navigation } from "./Navigation"
import { useHabitsContext } from "../hooks/useHabitsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import sync from '../assets/sync4.png'
import { UserCard } from "./UserCard"
import { format } from "date-fns"
import { MasteryGraph } from "./MasteryGraph"
import key from "../assets/key.png"

export const HabitData = () => {

  const { habits } = useHabitsContext()
  const { getLinkedHabits, getHabit } = useHabits()
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
      {/* <div className = "advanced-habit-info">
        <div className = "advanced-view">
          <div className = "advanced-view-left">
            <p>Prev</p>
          </div>
          <div className = "advanced-view-mid">
            <div className = "advanced-view-title">
              <h1> { habit.name }</h1>
            </div>
            <p>
            { habit.description && habit.description.length > 0 ? habit.description : "No Description Provided" } </p>
          </div>
          <div className = "advanced-view-right">
            <p>right</p>
          </div>
        </div>
      </div> */}

      <div className = "idk" >
        <div className = "advanced-stats">
          <p>{ habit.streak }</p>
          <h4>STREAK</h4>
        </div>
        <div className = "advanced-stats">
          <p>{ habit.maxStreak }</p>
          <h4>MAX STREAK</h4>
        </div>
        <div className = "advanced-stats">
          <p>{ syncedHabits.length }</p>
          <h4>LINKED USERS</h4>
        </div>
        <div className = "advanced-stats">
          <p> 79%</p>
          <h4>COMPLETION (%)</h4>
        </div>
        <div className = "advanced-stats">
          <p style = {{ fontSize:"35px", fontFamily: "Manrope" }}> Novice </p>
          <h4>HABIT MASTERY</h4>
        </div>
      </div>
      
      <div className = "synced-stats" style = {{marginTop: "50px"}}>
        <div className = "completion-graph">
          <h3> Habit Mastery</h3>
          <div style = {{marginTop:"30px", height:"300px", width:"300px", backgroundColor:"transparent"}}>
            <MasteryGraph habit = { habit }/>
          </div>
        </div>

        <div className = "calendar-container">
          {/* <h1> Calendar </h1> */}
          <Calendar habit = {habit}></Calendar>
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
            <UserCard key = { h._id } habit = { h }></UserCard>
          ))}
        </div>
      </div>
    </div>
  )
}
