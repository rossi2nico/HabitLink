import { createContext, useReducer } from 'react';

export const FriendsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FRIENDS':
      console.log('Setting friends:', action.payload);
      return {
        ...state,
        friends: action.payload,
      };

    case 'SET_PENDING_USERS':
      return {
        ...state,
        pendingUsers: action.payload,
      };

    case 'REMOVE_FRIEND':
      return {
        ...state,
        friends: state.friends.filter(
          (friend) => friend._id !== action.payload._id
        ),
      };

    case 'SEND_FRIEND_REQUEST':
      return {
        ...state
        // Empty until I add outgoing request in the user schema
      };

    case 'ACCEPT_FRIEND_REQUEST':
      return {
        ...state,
        pendingUsers: state.pendingUsers.filter(
          (user) => user._id.toString() !== action.payload._id.toString()
        ),
        friends: [action.payload, ...state.friends],
      };

    // JSON returns incomingUserId as opposed to accept friend request incomingUser obj
    case 'DECLINE_FRIEND_REQUEST':
      return {
        ...state,
        pendingUsers: state.pendingUsers.filter(
          (user) => user._id.toString() !== action.payload.toString()
        ),
      };

    default:
      return state;
  }
};

export const FriendsContext = createContext();

export const FriendsContextProvider = ({ children }) => {

  const initialState = {
    friends: [],
    pendingUsers: []
  };
  
  const [state, dispatch] = useReducer(FriendsReducer, initialState);

  return (
    <FriendsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </FriendsContext.Provider>
  );
};
