// import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'
import { useAuthContext } from '../hooks/useAuthContext';
import { Link } from 'react-router-dom';
import link from '../assets/sync4.png'
import { format } from 'date-fns';

export const Habit = ({ habit }) => {
  const { toggleComplete, linkHabit } = useHabits();
  const { user } = useAuthContext();

  const linkedUsers = habit.linkedHabits?.map((linkedHabit) => linkedHabit.userId); 

  const isUsersHabit = () => {
    return user?._id?.toString() === habit?.userId?.toString();
  }

  let today = new Date()
  today = format(today, 'yyyy-MM-dd')
  const isComplete = habit.completions[today] > 0

  const isLinked = () => {
    if (!user || !user._id) return false;
    
    return linkedUsers.some(
      linkedUser => linkedUser === user._id.toString()
    )
  }

  const usersHabit = isUsersHabit();
  const linked = isLinked();

  const originalHabitId = habit._id;

  return (
    <div className = "habit">
      <div className = {`completion-circle ${ isComplete  ? 'completed' : '' }`} onClick = {() => toggleComplete(habit._id)} >
          <div className = "circle-ring">
            <div className = "inner-circle">
              <p className = "habit-streak"> <strong>{ habit.streak } </strong></p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="40px" height="40px">
         <defs>
            <linearGradient id="GradientColor">
              <stop offset="0%" stopColor="#7cfbffff" />
              <stop offset="100%" stopColor="#00ff95ff" /> 
            </linearGradient>
         </defs>
         <circle cx="20" cy="20" r="18" strokeLinecap="round" />
        </svg>
      </div>
      <div className = "habit-div">
        <div className = "habit-mid">
              <Link to={`/habits/${habit._id}`} className = "habit-name"> { habit.name } </Link>
          {!usersHabit && (
            <p className = "habit-username"> from <strong>{ habit.userId }</strong> 
              {linkedUsers.length > 0 &&
                (linkedUsers.length === 1
                  ? ' • 1 user'
                  : ` • ${linkedUsers.length} users`)}
            </p>
          )}
          {usersHabit && (
            <p className="habit-username">
              {habit.privacy === 2
                ? ' Public'
                : habit.privacy === 1
                ? ' Friends-only'
                : ' Private'}

              {linkedUsers.length > 0 &&
                (linkedUsers.length === 1
                  ? ' • 1 user'
                  : ` • ${linkedUsers.length} users`)}
            </p>
          )}
          </div>
          <div className = "habit-right">

            {!usersHabit && (
              <div className = "link-info">
                {!linked ? (
                  <button onClick = { () => { linkHabit(originalHabitId, today) } } className = "link-button">Link Habit</button>
                ) : (
                  <p style = {{ alignSelf:'center', justifySelf:'center', padding:'5px' }}>Linked</p>
                )}
              </div>
            )}
          </div>
        </div>
    </div>
  )
}