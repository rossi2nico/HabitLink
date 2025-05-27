import { useState } from 'react'
import { useHabitsContext } from './useHabitsContext'
import { useAuthContext } from './useAuthContext'

export const useHabits = () => {

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useHabitsContext()
  const { user } = useAuthContext()

  const frequencyMap = { daily: 7, weekly: 1 }
  const privacyMap = { private: 0, friends: 1, public: 2 }

  const syncHabit = async () => {
    // tbd
  }

  const completeHabit = async () => {
    // tbd
  }

  // Modify this so that frequency and privacy are strings, then inside here convert it to the appropriate integer
  const createHabit = async (name, description, frequency, privacy) => {
    
    const habit = { name, description, frequency, privacy: privacyMap[privacy] ?? 0 }
    setIsLoading(true)
    setError(null)

    if (!user) {
      setError("You must be logged in")
      return false
    }

    const res = await fetch('/api/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      }
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setIsLoading(false)
      return false;
    }
    console.log('New habit created')
    dispatch({ type: 'CREATE_HABIT', payload: json })
    setIsLoading(false)
    return true;
  }

  const deleteHabit = async (habitId) => {
    setIsLoading(true)
    setError(null)

    if (!user) {
      setError("You must be logged in")
      return false
    }

    const res = await fetch(`/api/habits/${ habitId }`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      }
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setIsLoading(false)
      return false;
    }
    console.log('Habit successfully deleted')
    dispatch({ type: 'DELETE_HABIT', payload: json })
    setIsLoading(false)
    return true;
  }

  return { createHabit, deleteHabit, syncHabit, completeHabit, isLoading, error }
}