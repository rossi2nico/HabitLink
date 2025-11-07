import React from 'react';
import { useFriends } from '../hooks/useFriends';
import addUser from '../assets/add.png'


export const SearchUser = ({ user }) => {
  const { sendFriendRequest, isLoading } = useFriends();

  const handleAdd = async () => {
    const res = await sendFriendRequest(user._id);
    if (res.success) {
      alert(JSON.stringify(res.user));
    } else {
      alert(JSON.stringify(res.error));
    }
  };

  return (
    <div className="search-user-card">
      <div className = "search-user-card-left">
        <h1>{ user.username.charAt(0).toUpperCase() + user.username.slice(1) }</h1> 
      </div>
      <div className = "search-user-card-right">
        {/* <img className = "add-user" style = {{ width:'25px'}} src = { addUser }></img> */}
        <button className = "add-friend" onClick = { handleAdd }>Add Friend</button>
      </div>
    </div>
  );
};
