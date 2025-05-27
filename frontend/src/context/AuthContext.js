import { createContext, useReducer } from 'react'
import { useEffect } from 'react'

export const authReducer = (state, action) => {

  switch(action.type) {
    case 'LOGIN':
      return { user: action.payload }

    case 'LOGOUT':
      return { user: null }

    case 'SEND-FRIEND-REQUEST':
      return { user: {
        ...state.user, // keep all other properties in user
        pendingUsers: [action.payload, ...state.user.pendingUsers]
      }} 

    case 'ACCEPT-FRIEND-REQUEST':
      return { user: {
        ...state.user,
        pendingUsers: state.user.pendingUsers.filter(
          user => user !== action.payload
        ),
        friends: [action.payload, ...state.user.friends]
        }
      }
      
    case 'DECLINE-FRIEND-REQUEST':
      return { user: {
        ...state.user,
        pendingUsers: state.user.pendingUsers.filter(
          user => user !== action.payload 
        )
      }}
    default:
      return state
  }

}

export const AuthContext = createContext()
export const AuthContextProvider = ({ children }) => { 
    const [state, dispatch] = useReducer(authReducer, { user: null })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user) {
            dispatch({type: 'LOGIN', payload: user})
        }
    }, [])
    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value = {{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}