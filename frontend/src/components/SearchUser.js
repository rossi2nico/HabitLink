import React from 'react';
import { useFriends } from '../hooks/useFriends';

export const SearchUser = ({ user }) => {
  const { sendFriendRequest, isLoading } = useFriends();

  const handleAdd = () => {
    sendFriendRequest(user._id);
  };

  return (
    <div className="search-user-card">
      <span>{user.username}</span>
      <button 
        onClick={handleAdd} 
        className="add-friend-button"
        disabled={isLoading}
      >
        Add Friend
      </button>
    </div>
  );
};
