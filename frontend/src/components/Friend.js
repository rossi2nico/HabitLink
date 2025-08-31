import React from 'react';
import { useFriends } from '../hooks/useFriends';

export const Friend = ({ friend }) => {
  const { removeFriend, isLoading } = useFriends();

  const handleRemove = () => {
    removeFriend(friend._id);
  };

  return (
    <div className="friend-card">
      <p>@{friend.username.charAt(0).toUpperCase() + friend.username.slice(1)}</p>
      {/* <button 
        onClick={handleRemove} 
        className="remove-friend-button"
        disabled={isLoading}
      > Remove </button> */}
      <p>2 shared habits</p>
    </div>
  );
};
