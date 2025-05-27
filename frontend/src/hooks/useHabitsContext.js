import { HabitsContext } from "../context/HabitsContext";
import { useContext } from 'react'

export const useHabitsContext = () => {
  const context = useContext(HabitsContext)
  if (!context) {
    throw Error('useHabitsContext must be used within a HabitsContextProvider')
  }
  return context;
}
