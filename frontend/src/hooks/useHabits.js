import { useState } from 'react'
import { useHabitsContext } from './useHabitsContext'
import { useAuthContext } from './useAuthContext'

export const useHabits = () => {

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useHabitsContext()
  const { user } = useAuthContext()

  const getSyncedHabits = async (habitId) => {
    setIsLoading(true)
    setError(null) 

    if (!user) {
      setError('You must be logged in');
      return false;
    }

    const res = await fetch(`/api/habits/syncedHabits/${ habitId }`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ user.token }`,
        'Content-Type': 'application/json'
      }
    })

    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    setIsLoading(false)
    return json.syncedHabits;
  }

  const getHabit = async (habitId) => {
    setIsLoading(true)
    setError(null) 

    if (!user) {
      setError('You must be logged in');
      return false;
    }

    const res = await fetch(`/api/habits/${ habitId }`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ user.token }`,
        'Content-Type': 'application/json'
      }
    })

    const json = await res.json()
    console.log("json: ", json)
    if (!res.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    setIsLoading(false)
    dispatch({ type: 'GET_HABIT', payload: json })
    return json;
  }

  const updateHabit = async (habitId, ...updates) => {
    setIsLoading(true)
    setError(null)

    if (!user) {
      setError('You must be logged in')
      return false;
    }

    const res = await fetch(`/api/habits/${ habitId }`, {
      method: 'PATCH',
      body: JSON.stringify({
        updates
      }),
      headers: {
        'Authorization': `Bearer ${ user.token }`,
        'Content-Type': 'application/json'
      }
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    setIsLoading(false)
    dispatch({ type: 'UPDATE_HABIT', payload: json.habit})
    return true
  }

  const toggleComplete = async (habitId, dateCompleted) => {
    setIsLoading(true)
    setError(null)

    if (!user) {
      setError('You must be logged in')
      return false;
    }

    const res = await fetch('/api/habits/complete', {
      method: 'POST',
      body: JSON.stringify({
        habitId,
        dateCompleted
      }),
      headers: {
        'Authorization': `Bearer ${ user.token }`,
        'Content-Type': 'application/json'
      }
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    setIsLoading(false)
    dispatch({ type: 'TOGGLE_COMPLETE', payload: json.habit})
    return true
  }

  const syncHabit = async (originalHabitId, originalUserId, newPrivacy) => {
    // Privacy needs to be modified later
    setIsLoading(true)
    setError(null)

    if (!user) {
      setError('You must be logged in')
      return false;
    }

    const res = await fetch('/api/habits/sync', {
      method: 'POST',
      body: JSON.stringify({
        originalHabitId,
        originalUserId,
        privacy: newPrivacy
      }),
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

    const originalHabit = await fetch(`/api/habits/${originalHabitId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      }
    })
    const jsonOriginal = await originalHabit.json()
    if (!originalHabit.ok) {
      setError(jsonOriginal.error || "Failed to fetch original habit");
      setIsLoading(false);
      return false;
    }

    setIsLoading(false)
    dispatch({ type: 'SYNC_HABIT', payload: {
      newHabit: json,
      originalHabit: jsonOriginal
    }
    })
    return true
  }

  const getFriendHabits = async () => {

    setIsLoading(true)
    setError(null)

    if (!user) {
      setError('You must be logged in')
      return false;
    }

    const res = await fetch(`/api/habits/friends/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      }
    })
    const json = await res.json()
    if (!res.ok) {
      setIsLoading(false)
      setError(json.error)
      return []
    }
    setIsLoading(false)
    dispatch({ type: 'SET_FRIEND_HABITS', payload: json })
    return json;
  }

  const getTargetHabits = async (targetUserId) => {

    setIsLoading(true)
    setError(null)

    if (!user) {
      setError('You must be logged in')
      return false;
    }

    const res = await fetch(`/api/habits/public/${ targetUserId }`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      }
    })
    const json = await res.json()
    if (!res.ok) {
      setIsLoading(false)
      setError(json.error)
      return []
    }
    setIsLoading(false)
    return json;
  }

  const getPublicHabits = async () => {

    setIsLoading(true)
    setError(null)

    if (!user) {
      setError('You must be logged in')
      return false;
    }

    const res = await fetch('/api/habits/public', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ user.token }`
      }
    })
    const json = await res.json()
    if (!res.ok) {
      setIsLoading(false)
      setError(json.error)
      return []
    }
    setIsLoading(false)
    dispatch({ type: 'SET_PUBLIC_HABITS', payload: json })
    return json;

  }
  const getHabits = async () => {

    setIsLoading(true)
    setError(null)

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

  return { 
    getSyncedHabits, syncHabit, getHabit, getHabits, getFriendHabits, getPublicHabits, getTargetHabits, createHabit,
    updateHabit, deleteHabit, toggleComplete, isLoading, error }
}