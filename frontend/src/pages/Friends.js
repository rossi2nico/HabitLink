import { Navigation } from "../components/Navigation"
import { useFriends } from "../hooks/useFriends";
import { useHabits } from "../hooks/useHabits";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { useFriendsContext } from "../hooks/useFriendsContext";
import { useHabitsContext } from "../hooks/useHabitsContext";
import { Friend } from "../components/Friend";
import { Habit } from "../components/Habit";
import { SearchUser } from "../components/SearchUser";


const Friends = () => {

  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuthContext();
  const { friends, pendingUsers } = useFriendsContext();
  const { searchUsers, getFriends, getPendingUsers } = useFriends()
  const { friendHabits } = useHabitsContext()
  const { getFriendHabits } = useHabits()
  const [searchDebounce, setSearchDebounce] = useState(false);


  useEffect(() => { 
    if (user) {
      getFriends(user._id);
      getPendingUsers(user._id);
      getFriendHabits()
    }
  }, [user]);

  useEffect(() => {
    if (searchDebounce) return;
    if (searchTerm === '') {
      setSearchResults([]);
      return
    }
    setSearchDebounce(true);
    
    const fetchUsers = async () => {
      try {
        const users = await searchUsers(searchTerm);
        console.log("users: ", users);
        setSearchResults(users);
      } catch (err) {

      }
    }
    fetchUsers();

    setTimeout(() => {
      setSearchDebounce(false);
    }, 100);

  }, [searchTerm]);

  return (
    <>
      <Navigation></Navigation>
      <div className='friends-search'>

        <input
          type="search"
          className="search-users"
          value={searchTerm}
          placeholder="Enter friend username or ID"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {searchResults.length === 0 && searchTerm != "" ? (
          <p>No users found</p>
        ) : searchResults.length === 0 ?
          <></>
          : (
            <>
              {searchResults.map(user => (
                <SearchUser key={user._id} user={user}></SearchUser>
              ))}
            </>
          )}
      </div> 
      <div className = "friends-page">
        {/* Turn this into an array with arrows on sides */}
        <div className="friends-list"> 
          {/* <h2>Your Friends:</h2> */}
          {friends && friends.length > 0 ? (
            <div className="friends">
              {friends.map(friend => (
                <Friend key={friend._id} friend={friend}></Friend>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '15px', color: '#ff4775ff', fontWeight: '500' }}>Friend list is empty!</p>
          )}
        </div>
        <div className = "friend-habit-container">
          {/* <h2>Friend Habits</h2>
          <h5>asldjasd aiso djsdi</h5> */}

          <div className="friend-habits">
            {!friendHabits || friendHabits.length === 0 && (
              <>
                <h1>The best way to stay accountable <span> is with friends!</span></h1>
                <p>"Adapt yourself to the life you have been given and truly love the people with whom destiny has surrounded you."</p>
                <p style={{ margin: 0, fontSize: '12px' }}>-- Marcus Aurelius</p>
                <button>Add Friends!</button>
              </>

            )}
            {friendHabits && friendHabits.length > 0 &&
              friendHabits.map(friendHabit => (
                <Habit key={friendHabit._id} habit={friendHabit} />
              ))
            }

          </div>

        </div>
      </div>
      {/* <Footer></Footer> */}
    </>
  )
}

export default Friends

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