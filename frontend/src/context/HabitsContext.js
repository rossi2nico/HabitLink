import { createContext, useReducer } from 'react'

export const HabitsReducer = (state, action) => {
  switch(action.type) {

    case 'SET_HABITS':
      return {
        ...state,
        habits: action.payload
      }

    case 'CREATE_HABIT':
      return {
        ...state,
        habits: [action.payload, ...state.habits]      
      }

   case 'DELETE_HABIT': {
      const { deletedHabit, updatedSyncedHabits } = action.payload;

      const updatedMap = new Map(
        updatedSyncedHabits.map(h => [h._id.toString(), h])
      );

      return {
        ...state,

        habits: state.habits.filter(
          habit => habit._id.toString() !== deletedHabit._id.toString()
        ),

        friendHabits: state.friendHabits.map(habit =>
          updatedMap.has(habit._id.toString())
            ? updatedMap.get(habit._id.toString())
            : habit
        ),

        publicHabits: state.publicHabits.map(habit =>
          updatedMap.has(habit._id.toString())
            ? updatedMap.get(habit._id.toString())
            : habit
        )
      };
    }

    case 'UPDATE_HABIT': {
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit._id === action.payload._id ? action.payload : habit
        )
      }
    }

    case 'TOGGLE_COMPLETE': {
      const updatedHabit = action.payload;

      return {
        ...state,
        habits: state.habits.map(habit =>
          habit._id === updatedHabit._id ? updatedHabit : habit
        )
      };
    }

    case 'SET_PUBLIC_HABITS': {
      
      return {
        ...state,
        publicHabits: action.payload
      }
    }

    case 'SET_FRIEND_HABITS': {

      return {
        ...state, 
        friendHabits: action.payload
      }
    }

    case 'SYNC_HABIT': {
      const { newHabit, originalHabit } = action.payload;

      return {
        ...state,
        habits: [newHabit, ...state.habits],
        friendHabits: state.friendHabits.map(habit => habit._id === originalHabit._id ? originalHabit : habit),
        publicHabits: state.publicHabits.map(habit => habit._id === originalHabit._id ? originalHabit : habit)
      };
    }

    default:
      return state
  }
}

export const HabitsContext = createContext()
export const HabitsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(HabitsReducer, {
    habits: [],
    friendHabits: [],
    publicHabits: []
  })
  return (
    <HabitsContext.Provider value = {{...state, dispatch}}>
      { children }
    </HabitsContext.Provider>
  )
}