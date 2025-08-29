import { createContext, useReducer } from 'react'
import { useEffect } from 'react'

export const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, loading: false };

    case 'LOGOUT':
      return { ...state, user: null, loading: false };

    case 'LOADING_DONE':
      return { ...state, loading: false };

    case 'SEND-FRIEND-REQUEST':
      return {
        ...state,
        user: {
          ...state.user,
          pendingUsers: [action.payload, ...state.user.pendingUsers]
        }
      };

    case 'ACCEPT-FRIEND-REQUEST':
      return {
        ...state,
        user: {
          ...state.user,
          pendingUsers: state.user.pendingUsers.filter(
            u => u !== action.payload
          ),
          friends: [action.payload, ...state.user.friends]
        }
      };

    default:
      return state;
  }
}

export const AuthContext = createContext()
export const AuthContextProvider = ({ children }) => { 
    const [state, dispatch] = useReducer(authReducer, { user: null, loading: true });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user) {
            dispatch({type: 'LOGIN', payload: user})
        }
        dispatch({ type: 'LOADING_DONE' });
    }, [])
    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value = {{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}