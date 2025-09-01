import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext';
import { EditHabitForm } from './EditHabitForm'
import { Link } from 'react-router-dom';
import link from '../assets/sync4.png'

import del from '../assets/delete-red.png'

export const Habit = ({ habit }) => {

  const { getHabit, toggleComplete, syncHabit, deleteHabit } = useHabits();
  const { user } = useAuthContext();
  const syncedUsers = habit.syncedHabits.map((syncedHabit) => syncedHabit.userId); 

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

      <div className = {`completion-circle ${ complete  ? 'completed' : '' }`} onClick = {() => toggleComplete(habit)} >
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
      <div className = "habit-mid">
        <h4 className="habit-name">
          <strong>
            <Link to={`/habits/${habit._id}`} className = "habit-name">{habit.name}</Link>
          </strong>
        </h4>
        {!usersHabit && (
          <p className = "habit-username"> from <strong>{ habit.username }</strong> 
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
          {usersHabit ? (
            null
            // <img className = "habit-delete" onClick = {() => deleteHabit(habit._id)} style = {{ width:"15px", paddingRight:"12px", cursor:"Pointer"}} src = {del}></img>
          ) : (
            <>
              {!synced ? (
                <img className = "habit-link" src = {link} onClick = {() => syncHabit(originalHabitId, originalUserId, newPrivacy)}></img>
                // <h3 style = {{marginRight:"10px"}}onClick = {() => syncHabit(originalHabitId, originalUserId, newPrivacy)} >⇄</h3>
                // <></>
              ) : (
                <img src = "https://www.citypng.com/public/uploads/preview/hd-white-tick-mark-icon-symbol-sign-transparent-png-701751695044638vkmy5iy1kv.png"
                style = {{ width:"15px", paddingRight:"12px", cursor:"Pointer"}}></img>
                // <p style = {{fontWeight:'600',marginRight:"15px", fontSize:'12px'}}>Linked</p>
              )}
            </>
          )}
        </div>
    </div>
  )
}