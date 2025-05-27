import { useState } from 'react'
import { useHabitsContext } from './useHabitsContext'
import { useAuthContext } from './useAuthContext'

export const useHabits = () => {

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useHabitsContext()
  const { user } = useAuthContext()

  const syncHabit = async () => {
    // tbd
  }

  const completeHabit = async () => {
    // tbd
  }

  const getHabits = async () => {

    setIsLoading(true)
    setError(null)
    console.log('user token:', user?.token)

    if (!user) {
      setError('You must be logged in')
      return false;
    }

    const res = await fetch('/api/habits', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      }
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    console.log('Retrieved all habits')
    dispatch({ type: 'SET_HABITS', payload: json})
    setIsLoading(false)
    return true
  }

  // Modify this so that frequency and privacy are strings, then inside here convert it to the appropriate integer
  const createHabit = async (name, description, frequency, privacy) => {
    
    const habit = { name, description, frequency, privacy }
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

  return { getHabits, createHabit, deleteHabit, syncHabit, completeHabit, isLoading, error }
}