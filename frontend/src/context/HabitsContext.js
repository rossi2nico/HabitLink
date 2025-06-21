import { createContext, useReducer } from 'react'

export const HabitsReducer = (state, action) => {
  
  switch(action.type) {
    // Initializes or updates habits state
    case 'SET_HABITS':
      return {
        habits: action.payload
      }
    case 'CREATE_HABIT':
      return {
        habits: [action.payload, ...state.habits]      }
    case 'DELETE_HABIT':
      return {
        habits: state.habits.filter(
          habit => habit._id !== action.payload._id
        )
      }

    case 'TOGGLE_COMPLETE': {
      const updatedHabit = action.payload;

      return {
        habits: state.habits.map(habit =>
          habit._id === updatedHabit._id ? updatedHabit : habit
        )
      };
    }
    case 'SYNC_HABIT':
      return {
        // tbd
      }
    default:
      return state
    
  }
}

export const HabitsContext = createContext()
export const HabitsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(HabitsReducer, {
    habits: []
  })
  return (
    <HabitsContext.Provider value = {{...state, dispatch}}>
      { children }
    </HabitsContext.Provider>
  )
}