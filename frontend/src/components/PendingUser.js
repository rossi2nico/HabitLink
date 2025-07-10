
import React from 'react';
import { useFriends } from '../hooks/useFriends';

export const PendingUser = ({ incomingUser }) => {
  const { acceptFriendRequest, declineFriendRequest, isLoading } = useFriends();

  const handleAccept = () => {
    acceptFriendRequest(incomingUser._id);
  };

  const handleDecline = () => {
    declineFriendRequest(incomingUser._id);
  };

  return (
    <div className="pending-user-card">
      <span>{incomingUser.username}</span>
      <button 
        onClick={handleAccept} 
        className="accept-button"
        disabled={isLoading}
      >
        Accept
      </button>
      <button 
        onClick={handleDecline} 
        className="decline-button"
        disabled={isLoading}
      >
        Decline
      </button>
    </div>
  );
};