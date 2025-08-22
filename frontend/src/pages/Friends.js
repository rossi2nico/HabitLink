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
    }, 100)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  return (
    <>
      <Navigation></Navigation>

      <div className = 'friends-page'>
        <div className = 'friends-search'>
          <label ><h3> Search Users </h3> </label>
  
          <input 
            type = "search"
            className = "search-users"
            value = {searchTerm}
            onChange = {(e) => setSearchTerm(e.target.value)}
          />
          
          {searchResults.length === 0 && searchTerm != "" ? (
            <p>No users found</p>
          ) : searchResults.length === 0 ? 
            <></>
          : (
            <>
              {searchResults.map(user => (
                <SearchUser key = {user._id} user = {user}></SearchUser>
              ))}
            </>
          )}  
        </div>

        <div className = 'friends-left'>

          {friends && friends.length > 0 ? (
            <div className="friends">
              <h3>Friends List</h3>
              <div className = "underline"></div>
              {friends.map(friend => (
                <Friend key = {friend._id} friend = {friend}></Friend>

              ))}
            </div>
          ) : (
            <div className="friends">
              <h3> Your Friends</h3>
              <p> Friend List is Empty </p>
            </div>
          )}

          {pendingUsers && pendingUsers.length > 0 ? (
            <div className="pending-users">
              <h3>Pending Friend Requests</h3>
              <div className = "underline"></div>
              {pendingUsers.map(pendingUser => (
                <PendingUser key = {pendingUser._id} incomingUser = {pendingUser}></PendingUser>
  
              ))}
            </div>
          ) : (
            <div className="pending-users">
              <h3> Friend Requests </h3>
                <div className = "underline"></div>
              <p>No Pending Friend Requests</p>
            </div>
          )}
        </div>
        
      </div>
    </>
  )

}

export default Friends;