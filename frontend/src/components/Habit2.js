import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import link from '../assets/sync4.png'
import { format } from 'date-fns';

export const Habit = ({ habit }) => {

  const { getHabit, toggleComplete2, syncHabit2, deleteHabit } = useHabits();
  const { user } = useAuthContext();
  const syncedUsers = habit.linkedHabits.map((syncedHabit) => syncedHabit.userId); 

  const isUsersHabit = () => {
    return user?._id?.toString() === habit?.userId?.toString();
  }

  let today = new Date()
  today = format(today, 'yyyy-MM-dd')
  const isComplete = habit.completions[today] > 0

  const isSynced = () => {
    if (!user || !user._id) return false;
    
    return syncedUsers.some(
      syncedUser => syncedUser === user._id.toString()
    )
  }

  const usersHabit = isUsersHabit();
  const synced = isSynced();

  const originalHabitId = habit._id;

  return (
    <div className = "habit">
      <div className = {`completion-circle ${ isComplete  ? 'completed' : '' }`} onClick = {() => toggleComplete2(habit._id)} >
          <div className = "circle-ring">
            <div className = "inner-circle">
              <p className = "habit-streak"> <strong>{ habit.streak } </strong></p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="40px" height="40px">
         <defs>
            <linearGradient id="GradientColor">
              <stop offset="0%" stopColor="#41ccdfff" />
              <stop offset="100%" stopColor="#00e284ff" /> 
            </linearGradient>
         </defs>
         <circle cx="20" cy="20" r="18" strokeLinecap="round" />
        </svg>
      </div>
      <div className = "habit-div">
        <div className = "habit-mid">
              <Link to={`/habits/${habit._id}`} className = "habit-name">{habit.name}</Link>
          {!usersHabit && (
            <p className = "habit-username"> from <strong>{ habit.userId }</strong> 
              {syncedUsers.length > 0 &&
                (syncedUsers.length === 1
                  ? ' • 1 user'
                  : ` • ${syncedUsers.length} users`)}
            </p>
          )}
          {usersHabit && (
            <p className="habit-username">
              {habit.privacy === 2
                ? ' Public'
                : habit.privacy === 1
                ? ' Friends-only'
                : ' Private'}

              {syncedUsers.length > 0 &&
                (syncedUsers.length === 1
                  ? ' • 1 user'
                  : ` • ${syncedUsers.length} users`)}
            </p>
          )}
          </div>
          <div className = "habit-right">
            <div className = "habit-buttons">
              <Link to={`/habits/${habit._id}`} className = "view-analytics">View Stats</Link>
            </div>

            {usersHabit ? (
              null
            ) : (
              <>
                {!synced ? (
                  <img className = "habit-link" src = {link} onClick = {() => syncHabit2(originalHabitId)}></img>

                ) : (
                  <p style = {{ alignSelf:'center', justifySelf:'center', padding:'5px' }}>Linked</p>
                )}
              </>
            )}
          </div>
        </div>
    </div>
  )
}