import React from 'react';
import { useFriends } from '../hooks/useFriends';

export const Friend = ({ friend }) => {
  const { removeFriend, isLoading } = useFriends();

  const handleRemove = () => {
    removeFriend(friend._id);
  };

  return (
    <div className="friend-card">
      <span>{friend.username}</span>
      <button 
        onClick={handleRemove} 
        className="remove-friend-button"
        disabled={isLoading}
      >
        Remove Friend
      </button>
    </div>
  );
};
