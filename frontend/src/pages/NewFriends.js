import { Navigation } from "../components/Navigation"
import { useFriends } from "../hooks/useFriends";
import { useHabits } from "../hooks/useHabits";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { useFriendsContext } from "../hooks/useFriendsContext";
import { useHabitsContext } from "../hooks/useHabitsContext";
import { Habit } from "../components/Habit2";
import { Friend } from "../components/Friend";
import { SearchUser } from "../components/SearchUser";

const NewFriends = () => {

  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthContext();
  const { friends, pendingUsers } = useFriendsContext();
  const { getFriends, getPendingUsers } = useFriends()
  const { friendHabits } = useHabitsContext()
  const { getFriendHabits } = useHabits()

  useEffect(() => { 
    if (user) {
      getFriends(user._id);
      getPendingUsers(user._id);
      getFriendHabits()
    }
  }, [user]);

  return (
    <>
      <Navigation></Navigation>
      <div className = "friends-page">
        <div className = "friends-left">
          <div className = "intro">
            <h3>Community & Friends</h3>
            <p>Sync with friend habits to stay accountable and grow together!</p>
          </div>
        </div>
        <div className="friend-habits">
          <h2>Friend Habits </h2>
          {!friendHabits || friendHabits.length === 0 && (
            <p>No friend habits!</p>
          )}
          {friendHabits && friendHabits.length > 0 && 
            friendHabits.map(friendHabit => (
              <Habit key = {friendHabit._id} habit = { friendHabit } />
            ))
          }
        </div>
        {/* <div className = "friends-list"> 
          <h2>Your Friends:</h2>
          {friends && friends.length > 0 ? (
            <div className = "friends">
              {friends.map(friend => (
                <Friend key = { friend._id } friend = { friend }></Friend>
              ))}
            </div>
          ) : (
            <p style = {{fontSize:'15px', color: '#ff4775ff', fontWeight:'500'}}>Friend list is empty!</p>
          )}
        </div> */}
      </div>
    </>
  )
}

export default NewFriends

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
          
          {/* <div className = "friend-habits">
            {friendHabits && friendHabits.map(habit => {
              return <p key = { habit.id }> { habit.name } </p>
            })}
          </div> */}