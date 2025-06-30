import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext';
import { EditHabitForm } from './EditHabitForm'

export const Habit = ({ habit }) => {

  const { toggleComplete, syncHabit, deleteHabit } = useHabits();
  const { user } = useAuthContext();
  const [editingHabit, setEditingHabit] = useState(null);

  const isUsersHabit = () => {
    return user?._id?.toString() === habit?.userId?.toString();
  }

  const syncedUsers = habit.syncedHabits.map((syncedHabit) => syncedHabit.userId); 
  const syncedUsernames = habit.syncedHabits.map((syncedHabits) => syncedHabits.username)

  const sameDate = (d1, d2) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        )
    }

  const isSynced = () => {
    if (!user || !user._id) return false;
    
    return syncedUsers.some(
      syncedUser => syncedUser === user._id.toString()
    )
  }

  const isComplete = () => {
    const today = new Date();
    const len = habit.completions.length;
    if (len === 0) {
      return false;
    }
    const lastDate = new Date(habit.completions[len - 1]);
    return sameDate(today, lastDate);
  }

  const complete = isComplete();
  const usersHabit = isUsersHabit();
  const synced = isSynced();

  const originalHabitId = habit._id;
  const originalUserId = habit.userId;
  const newPrivacy = 0;

  return (
    <div className = "habit">
      <div className = "left">
        <h3>{habit.name}</h3>
        {/* <p>frequency: {habit.frequency}</p>
        <p>streak: {habit.streak} </p> */}
        
        <p className = "habit-id"> ID: {habit._id} </p>

        {habit.privacy === 2 ? (
          <p className = "privacy"> Public </p>
        ) : habit.privacy === 1 ? (
          <p className = "privacy"> Friends </p>
        ) : (
          <p className = "privacy"> Private </p>
        )}

        {habit.frequency === 7 ? (
          <p> Daily </p>
        ) : habit.frequency === 1 ? (
          <p> Weekly </p>
        ) : (
          <p> Custom frequency </p>
        )}
        <p style = {{ marginTop: "-15px" }}> Streak: { habit.streak }, Max: { habit.maxStreak } </p>

           
      </div>
      <div className = "right">
        {syncedUsers.length > 0 ? (
          <>
            <p style = {{ marginBottom: "-10px" }}> Synced Users: </p>
            <p style = {{ fontSize: "15px" }}> {syncedUsernames.join(", ")} </p>
            
            
          </>
        ) : ( 
          <p> No synced users </p>
        )}  
        
        {usersHabit ? (
          <>
              <button onClick={() => toggleComplete(habit._id)}>
                <p style={{ margin: 0 }}>
                  {complete ? 'Mark as incomplete' : 'Mark as complete'}
                </p>
              </button>
              <button onClick = { () => deleteHabit(habit._id) }>
                <p style = {{ margin: 0 }}>
                  Delete Habit
                </p>
              </button>
              {/* <button onClick={() => setEditingHabit(habit)}>
                Edit habit
              </button> */}
          </>
        ) : (
          <>
            {synced ? (
              <p>
               Synced!
              </p>
            ): (
              <button onClick = {() => syncHabit(originalHabitId, originalUserId, newPrivacy)}>
                Sync Habit
              </button>
            )}
          </>
        )}

      </div>
    </div>
  )
}