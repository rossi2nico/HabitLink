import { AuthContext } from "../context/AuthContext"
import { useContext, useState } from "react";
import { useFriendsContext } from "./useFriendsContext";

export const useFriends = () => {

  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useFriendsContext();

  const searchUsers = async (searchTerm) => {
    setIsLoading(true);
    setError(null);
    if (!user) {
      setError('You must be logged in');
      return false;
    }

    const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }` 
      }
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    dispatch({ type: 'SEARCH_USERS', payload: json });
    return json;
  }

  const removeFriend = async (friendId) => {
    setIsLoading(true);
    setError(null);
    if (!user) {
      setError('You must be logged in');
      return false;
    }

    const res = await fetch('/api/users/remove-friend', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }` 
      },
      body: JSON.stringify({ targetUserId: friendId })
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    dispatch({ type: 'REMOVE_FRIEND', payload: json });
    return json;
  }

  const acceptFriendRequest = async (friendId) => {
    setIsLoading(true);
    setError(null);

    if (!user) {
      setError('You must be logged in');  
      return false;
    }

    const res = await fetch('/api/users/accept-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }` 
      },
      body: JSON.stringify({ targetUserId: friendId })
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setIsLoading(false);
      return false; 
    }
    setIsLoading(false);
    dispatch({ type: 'ACCEPT_FRIEND_REQUEST', payload: json });    
    return json;
  }

  const sendFriendRequest = async (friendId) => {
    setIsLoading(true);
    setError(null);

    if (!user) {
      setError('You must be logged in');  
      return false;
    }

    const res = await fetch('/api/users/send-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }` 
      },
      body: JSON.stringify({ targetUserId: friendId })
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setIsLoading(false);
      return false; 
    }
    setIsLoading(false);
    switch (json.status) {
      case 'request_sent':
        dispatch( { type: 'SEND_FRIEND_REQUEST', payload: json.targetUser });
        break;
      case 'friend_added':
        dispatch( { type: 'ACCEPT_FRIEND_REQUEST', payload: json.targetUser });
        break;
      default:
        setError('An error occurred while sending the friend request.');
    }
    return json;
  }

  const declineFriendRequest = async (friendId) => {
    setIsLoading(true); 
    setError(null);
    if (!user) {
      setError('You must be logged in');  
      return false;
    }
    const res = await fetch('/api/users/decline-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }` 
      },
      body: JSON.stringify({ targetUserId: friendId })
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      setIsLoading(false);
      return false; 
    }
    setIsLoading(false);
    dispatch({ type: 'DECLINE_FRIEND_REQUEST', payload: json });
    return json;
  }
  
  const getFriends = async (userId) => {
    
    setIsLoading(true)
    setError(null) 

    if (!user) {
      setError('You must be logged in');
      return false;
    }

    const res = await fetch(`/api/users/${ userId }/friends`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      }
    });
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    setIsLoading(false)
    dispatch({ type: 'SET_FRIENDS', payload: json })
    return json;
  }

  const getPendingUsers = async (userId) => {
    setIsLoading(true)
    setError(null)

    if (!user) {
      setError('You must be logged in');
      return false;
    }

    const res = await fetch(`/api/users/${ userId }/pending-users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      }
    });
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    setIsLoading(false)
    dispatch({ type: 'SET_PENDING_USERS', payload: json })
    return json;
  }

  return {
    isLoading,
    error,
    removeFriend,
    acceptFriendRequest,
    sendFriendRequest,
    declineFriendRequest,
    getFriends,
    getPendingUsers,
    searchUsers
  }
}