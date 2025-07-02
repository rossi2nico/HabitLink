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
        // Empty until I add outgoing request in the user schema
      };

    case 'ACCEPT_FRIEND_REQUEST':
      return {
        ...state.user,
        pendingUsers: state.pendingUsers.filter(
          (user) => user !== action.payload
        ),
        friends: [action.payload, ...state.friends],
      };

    case 'DECLINE-FRIEND-REQUEST':
      return {
        ...state.user,
        pendingUsers: state.pendingUsers.filter(
          (user) => user !== action.payload
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
