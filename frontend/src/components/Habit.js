import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext';
import { EditHabitForm } from './EditHabitForm'
import noTick from '../assets/not_tick.png'
import tick from '../assets/blue_tick.png'
import del from '../assets/delete-red.png'
import link from '../assets/link.png'

export const Habit = ({ habit }) => {

  const { getHabit, toggleComplete, syncHabit, deleteHabit } = useHabits();
  const { user } = useAuthContext();
  const [editingHabit, setEditingHabit] = useState(null);
  const [syncedHabits, setSyncedHabits] = useState([]);
  const [fetchedHabitIds, setFetchedHabitIds] = useState(new Set());
  const syncedUsers = habit.syncedHabits.map((syncedHabit) => syncedHabit.userId); 
  const syncedUsernames = habit.syncedHabits.map((syncedHabits) => syncedHabits.username);

  const isUsersHabit = () => {
    return user?._id?.toString() === habit?.userId?.toString();
  }

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
      <div className = "habit-left">
        <img className = "toggle-img" src = {complete ? tick : noTick } alt = "checkbox" onClick = {() => toggleComplete(habit._id)}></img>
        <p className = "habit-streak"> { habit.streak } </p>
      </div>
      <div className = "habit-mid">
        <h4 className = "habit-name">{ habit.name }</h4>
        {!usersHabit && (
          <p className = "habit-username"> from <strong>{ habit.username }</strong> 
          
          {syncedUsers.length > 0 &&
              (syncedUsers.length === 1
                ? ' 👤 1 user'
                : ` 👥 ${syncedUsers.length} users`)}
      
           </p>
        )}
        {usersHabit && (
          <p className="habit-username">
            {habit.privacy === 2
              ? '🔓 Public'
              : habit.privacy === 1
              ? '🔏 Friends'
              : '🔒 Private'}

            {syncedUsers.length > 0 &&
              (syncedUsers.length === 1
                ? ' 👤 1 user'
                : ` 👥 ${syncedUsers.length} users`)}
          </p>
)}

        {/* <div className = "habit-name">
          <h4> { habit.name } </h4>
        </div>
        {!usersHabit && (
            <p style = {{fontSize:"12px"}}> { habit.username } </p>
          )} */}
        
      </div>
      <div className = "habit-right">
        {/* <div className = "habit-stats"> */}
          {/* <p className = "habit-streak">🔥{ habit.streak } (Max { habit.maxStreak }) </p> */}

          {usersHabit ? (
            <img onClick = {() => deleteHabit(habit._id)} style = {{ width:"18px", paddingRight:"20px", cursor:"Pointer"}} src = {del}></img>
          ) : (
            <>
              {/* <p style = {{ fontSize:"10px" }}>link habit</p> */}
              <img className = "habit-link" src = {link} onClick = {() => syncHabit(originalHabitId, originalUserId, newPrivacy)}></img>
            </>
          )}
          

          {/* <p className="habit-privacy">
            {habit.privacy === 2
            ? '🔓 Public'
            : habit.privacy === 1
            ? '🔏 Friends'
            : '🔒 Private'}
          </p>
          
          {syncedUsers.length > 0 && (
            <p>
              {syncedUsers.length === 1
                ? '👤 1 user'
                : `👥 ${syncedUsers.length} users`}
            </p>
          )} */}

        </div>
      {/* </div> */}
    </div>

    // <div className = "habit">
    //   <div className = "left">
    //     <h3>{habit.name}</h3>
    //     <p style = {{ marginTop: "-18px", fontSize: '12px' }}> Streak: { habit.streak }, Max: { habit.maxStreak } </p>


    //     {usersHabit && (
    //       <>
    //         <p className = "toggle-complete" onClick = {() => toggleComplete(habit._id)}>
    //           [ {complete ? 'Mark as incomplete' : 'Mark as complete'} ] 
    //         </p>
            
    //         <p className = "delete-button" onClick = {() => deleteHabit(habit._id)}>
    //           [ Delete Habit ]
    //         </p>
    //       </>
    //       // <button className = "toggle-complete" onClick={() => toggleComplete(habit._id)}>
    //       //   <p style={{ margin: 0 }}>
    //       //     {complete ? 'Mark as incomplete' : 'Mark as complete'}
    //       //   </p>
    //       // </button>
    //     )}

    //     {/* <p>frequency: {habit.frequency}</p>
    //     <p>streak: {habit.streak} </p> */}
        
    //     {/* {habit.privacy === 2 ? (
    //       <p className = "privacy"> Public </p>
    //     ) : habit.privacy === 1 ? (
    //       <p className = "privacy"> Friends </p>
    //     ) : (
    //       <p className = "privacy"> Private </p>
    //     )}

    //     {habit.frequency === 7 ? (
    //       <p> Daily </p>
    //     ) : habit.frequency === 1 ? (
    //       <p> Weekly </p>
    //     ) : (
    //       <p> Custom frequency </p>
    //     )} */}

           
    //   </div>
    //   <div className = "right">
    //     {syncedUsers.length > 0 ? (
    //       <>
    //         <p style = {{ marginBottom: "-10px" }}> Synced Users: </p>
    //         <p style = {{ fontSize: "15px" }}> {syncedUsernames.join(", ")} </p>
            
    //         {syncedHabits.map((habit) => (
    //          <> 
    //           <p key={habit._id}>??:{habit.username}</p>
    //         </>
    //         ))}
            
            
    //       </>
    //     ) : ( 
    //       <p> Synced Users: 0 </p>
    //     )}  
        
    //     {usersHabit ? (
    //       <>
              
    //           {/* <button onClick={() => setEditingHabit(habit)}>
    //             Edit habit
    //           </button> */}
    //       </>
    //     ) : (
    //       <>
    //         {synced ? (
    //           <p>
    //            Synced!
    //           </p>
    //         ): (
    //           <button onClick = {() => syncHabit(originalHabitId, originalUserId, newPrivacy)}>
    //             Sync Habit
    //           </button>
    //         )}
    //       </>
    //     )}

    //   </div>
    // </div>
  )
}