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
        {/* <div className = 'friends-search'>
          <label><h3> Search All Users </h3></label>
  
          <input 
            type = "search"
            className = "search-users"
            value = {searchTerm}
            placeholder = "Enter username"
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
        </div> */}
        <div style = {{ width: '700px', padding:'5px 25px 25px 25px', paddingBottom: '30px', marginTop:'40px'}}className = "user-habits">
          <h3>Friends</h3>

          {friends && friends.length > 0 ? (
            
            <div className = "friends">
              
              {friends.map(friend => (
                <Friend key = {friend._id} friend = {friend}></Friend>
              ))}
            </div>

          ) : (
            <p style = {{fontSize:'15px', color: '#ff4775ff', fontWeight:'500'}}>Friend list is empty!</p>
          )}
        </div>
        <div style = {{ padding:'0', paddingBottom: '30px', marginTop:'40px'}}className = "user-habits">
          {pendingUsers && pendingUsers.length > 0 ? (
            <div className="pending-users">
              <h3>Pending Requests</h3>
              {pendingUsers.map(pendingUser => (
                <PendingUser key = {pendingUser._id} incomingUser = {pendingUser}></PendingUser>
  
              ))}
            </div>
          ) : (
            <div className="pending-users">
              <h3> Friend Requests </h3>
              <p style = {{fontSize:'15px', color: '#ff4775ff', fontWeight:'500'}}>No Pending Friend Requests</p>
            </div>
          )}        
        </div>
      </div>
    </>
  )

}

export default Friends;