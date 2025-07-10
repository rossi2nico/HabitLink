import { useFriends } from "../hooks/useFriends";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect } from "react";
import { useFriendsContext } from "../hooks/useFriendsContext";
import { Navigation } from "../components/Navigation";
import { useState } from "react";
import { PendingUser } from "../components/PendingUser";
import { Friend } from "../components/Friend";
import { SearchUser } from "../components/SearchUser";

const Friends = () => {

  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthContext();
  const { friends, pendingUsers } = useFriendsContext();
  const { searchUsers, removeFriend, sendFriendRequest, getPendingUsers, getFriends, acceptFriendRequest, declineFriendRequest, error, isLoading } = useFriends();

  useEffect(() => { 
    if (user) {
      getFriends(user._id);
      getPendingUsers(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }
    // debounce?
    // call API, set searchResults to them
    const delayDebounce = setTimeout(() => {
      const fetchResults = async () => {
        const results = await searchUsers(searchTerm);
        setSearchResults(results || []);
      }
      fetchResults();
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  return (
    <>
      <Navigation></Navigation>
      <div className = 'friends-page'>
        <div className = 'friends-page-left'>
          {friends && friends.length > 0 ? (
            <div className="friends">
              <h3>Friends List</h3>
              {friends.map(friend => (
                <Friend key = {friend._id} friend = {friend}></Friend>
                // <div key={friend._id} className="friend">
                //   <span>{friend.username}</span>
                //   {/* <button onClick={() => removeFriend(friend._id)}>Remove Friend</button> */}
                // </div>
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
                <PendingUser key = {pendingUser._id} incomingUser = {pendingUser}></PendingUser>
                // <div key={pendingUser._id} className="pending-user">
                //   <span>{pendingUser.username}</span>
                // </div>
              ))}
            </div>
          ) : (
            <div className="pending-users">
              <h3>No Pending Friend Requests</h3>
            </div>
          )}
          <p>Errors and loading are showing here</p>
          {error && <div className="error">{error}</div>}
          {isLoading && <div className="loading">Loading...</div>}
        </div>
        <div className = 'friends-search'>
          <label for = "search-users">Search Users</label>
          <input 
            type = "search"
            className = "search-users"
            value = {searchTerm}
            onChange = {(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style = {{color:'Black', marginLeft:'20px'}}>
          <h3> Search Results</h3>
          {searchResults.length === 0 ? (
            <p>No users found</p>
          ) : (
            searchResults.map(user => (
              <SearchUser key = {user._id} user = {user}></SearchUser>
              // <div key={user._id} className="user-card">
              //   <p>{user.username}</p>
              //   {/* add more user info/buttons here if needed */}
              // </div>
            ))
          )}
        </div>
      </div>
    </>
  )

}

export default Friends;