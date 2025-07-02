import { useFriends } from "../hooks/useFriends";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect } from "react";
import { useFriendsContext } from "../hooks/useFriendsContext";
import { Navigation } from "../components/Navigation";

const Friends = () => {

  const { user } = useAuthContext();

  const { friends, pendingUsers } = useFriendsContext();
  const { removeFriend, sendFriendRequest, getPendingUsers, getFriends, acceptFriendRequest, declineFriendRequest, error, isLoading } = useFriends();

  useEffect(() => { 
    if (user) {
      getFriends(user._id);
      getPendingUsers(user._id);
    }
  }, [user]);

  return (
    <>
      <Navigation></Navigation>
      {friends && friends.length > 0 ? (
        <div className="friends">
          <h3>Friends List</h3>
          {friends.map(friend => (
            <div key={friend} className="friend">
              <span>{friend}</span>
              {/* <button onClick={() => removeFriend(friend._id)}>Remove Friend</button> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="friends">
          <h3>No Friends Found</h3>
        </div>
      )}

      {pendingUsers && pendingUsers.length > 0 ? (
        <div className="pending-users">
          <h3>Pending Friend Requests</h3>
          {pendingUsers.map(pendingUser => (
            <div key={pendingUser} className="pending-user">
              <span>{pendingUser}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="pending-users">
          <h3>No Pending Friend Requests</h3>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {isLoading && <div className="loading">Loading...</div>}
    </>
  )

}

export default Friends;