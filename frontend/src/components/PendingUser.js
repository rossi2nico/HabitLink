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
      <div className = "pending-user-card-left">
        <span>{incomingUser.username.charAt(0).toUpperCase() + incomingUser.username.slice(1)}</span>
      </div>
      <div className = "pending-user-card-right">
        
      </div>
    </div>
  );
};