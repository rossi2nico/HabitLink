import React, { useEffect } from 'react';
import { useFriends } from '../hooks/useFriends';
import { useHabitsContext } from "../hooks/useHabitsContext";
import { useHabits } from '../hooks/useHabits';
import { useAuthContext } from '../hooks/useAuthContext';
import { Habit } from './Habit2';
import sync from '../assets/sync4.png'
import batman from '../assets/batman.png'

export const Friend = ({ friend }) => {
 
  const { user } = useAuthContext();
  const { removeFriend, isLoading } = useFriends();
  const { friendHabits } = useHabitsContext()
  const { getFriendHabits } = useHabits()

  useEffect(() => {
    if (user) {
      getFriendHabits()
    }
  }, [user])

  const sharedHabits = friendHabits.filter(habit => {
    return habit.userId === friend._id;
  });

  const handleRemove = () => {
    removeFriend(friend._id);
  };

  return (
    <div className="friend-card">
      <div className = 'friend-info'>
        <h3>
          <img style = {{ padding:'5px', marginRight: '3px' }} src = { batman } ></img>
          {friend.username.charAt(0).toUpperCase() + friend.username.slice(1)}</h3>
        
      </div>
      <div className = "friend-shared-habits">
        {sharedHabits && sharedHabits.length > 0 ? (
          sharedHabits.map(habit => {
            return <p className = "shared-habit" key = { habit._id }> { habit.name } 
            <img
              className = "sync-habit-small"
              src = { sync }
            >
            </img> </p>
          })
        ) : ( 
          <p className = "shared-habit"> No shared friend habits</p>
        )}
        
      </div>
    </div>
  );
};
