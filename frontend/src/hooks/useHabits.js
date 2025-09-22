import { useState } from 'react'
import { useHabitsContext } from './useHabitsContext'
import { useAuthContext } from './useAuthContext'
import { format } from 'date-fns'
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useHabits = () => {

  const { dispatch } = useHabitsContext()
  const { user } = useAuthContext()

  const getHabit2 = async (habitId, currentDate) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }
    if (!currentDate) {
      currentDate = format(new Date(), 'yyyy-MM-dd');
    }
    const res = await fetch(`${BACKEND_URL}/api/habits/2/${habitId}?currentDate=${currentDate}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    const json = await res.json()

    if (!res.ok) {
      return { success: false, error: json.error }
    }

    dispatch({ type: 'GET_HABIT', payload: json })
    return { success: true, habit: json }
  }
  const getHabit = async (habitId) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }

    const res = await fetch(`${BACKEND_URL}/api/habits/${habitId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    const json = await res.json()

    if (!res.ok) {
      return { success: false, error: json.error }
    }

    dispatch({ type: 'GET_HABIT', payload: json })
    return { success: true, habit: json }
  }

  const getHabits = async (currentDate) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }
    if (!currentDate) {
      currentDate = format(new Date(), 'yyyy-MM-dd');
    }

    const res = await fetch(`${BACKEND_URL}/api/habits/2?currentDate=${currentDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await res.json()
    console.log("here", json)
    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    dispatch({ type: 'SET_HABITS', payload: json})
    return { success: true, habits: json }
  }

  // const getHabits = async () => {
  //   if (!user) {
  //     return { success: false, error: 'You must be logged in' }
  //   }

  //   const res = await fetch(`${BACKEND_URL}/api/habits`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${user.token}`
  //     }
  //   })
    
  //   const json = await res.json()
    
  //   if (!res.ok) {
  //     return { success: false, error: json.error }
  //   }
    
  //   dispatch({ type: 'SET_HABITS', payload: json})
  //   return { success: true, habits: json }
  // }

  const getFriendHabits = async (currentDate) => {
    if (!user) return { success: false, error: 'You must be logged in' }
    if (!currentDate) currentDate = format(new Date(), 'yyyy-MM-dd')

    const res = await fetch(`${BACKEND_URL}/api/habits/friends?currentDate=${currentDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await res.json()
    
    if (!res.ok) {
          console.log("not through now")

      return { success: false, error: json.error }
    }
    console.log("went through now")
    dispatch({ type: 'SET_FRIEND_HABITS', payload: json })
    return { success: true, habits: json }
  }

  const getPublicHabits = async () => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }

    const res = await fetch(`${BACKEND_URL}/api/habits/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await res.json()
    
    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    dispatch({ type: 'SET_PUBLIC_HABITS', payload: json })
    return { success: true, habits: json }
  }

  const getLinkedHabits = async (habitId) => {
    if (!user) return { success: false, error: 'You must be logged in' }

    const res = await fetch(`${BACKEND_URL}/api/habits/2/linkedHabits/${habitId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const json = await res.json() 
    if (!res.ok) return { success: false, error: json.error }
    return { success: true, linkedHabits: json.linkedHabits }
  }

  const getSyncedHabits = async (habitId) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }

    const res = await fetch(`${BACKEND_URL}/api/habits/syncedHabits/${habitId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })

    const json = await res.json()
    
    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    return { success: true, syncedHabits: json.syncedHabits }
  }

  const getTargetHabits = async (targetUserId) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }

    const res = await fetch(`${BACKEND_URL}/api/habits/public/${targetUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await res.json()
    
    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    return { success: true, habits: json }
  }
  const createHabit2 = async (name, privacy, startDate) => {

    if (!user) return { success: false, error: "You must be logged in" }
    if (!privacy) privacy = 0;
    if (!startDate) startDate = format(new Date(), 'yyyy-MM-dd');
    if (!name) return { success: false, error: "Habit name is required" }
    
    const habit = { name, privacy, startDate }

    const res = await fetch(`${BACKEND_URL}/api/habits/2`, {
      method: 'POST',
      body: JSON.stringify(habit),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await res.json()
    
    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    dispatch({ type: 'CREATE_HABIT', payload: json })
    return { success: true, habit: json }
  }

  const createHabit = async (name, description, frequency, privacy) => {
    if (!user) {
      return { success: false, error: "You must be logged in" }
    }

    const habit = { name, description, frequency, privacy }

    const res = await fetch(`${BACKEND_URL}/api/habits`, {
      method: 'POST',
      body: JSON.stringify(habit),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await res.json()
    
    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    dispatch({ type: 'CREATE_HABIT', payload: json })
    return { success: true, habit: json }
  }

    const deleteHabit2 = async (habitId) => {
      if (!user) {
        return { success: false, error: "You must be logged in" }
      }
  
      const res = await fetch(`${BACKEND_URL}/api/habits/2/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        return { success: false, error: json.error }
      }
      
      dispatch({ type: 'DELETE_HABIT', payload: json })
      return { success: true, habit: json }
    }

  const deleteHabit = async (habitId) => {
    if (!user) {
      return { success: false, error: "You must be logged in" }
    }

    const res = await fetch(`${BACKEND_URL}/api/habits/${habitId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await res.json()
    
    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    dispatch({ type: 'DELETE_HABIT', payload: json })
    return { success: true, habit: json }
  }

  const updateHabit = async (habitId, ...updates) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }

    const res = await fetch(`${BACKEND_URL}/api/habits/${habitId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        updates
      }),
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const json = await res.json()
    
    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    dispatch({ type: 'UPDATE_HABIT', payload: json.habit})
    return { success: true, habit: json.habit }
  }

  const toggleComplete2 = async(habitId, dateCompleted, currentDate, valueCompleted) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }
  
    if (!dateCompleted) {
      dateCompleted = new Date();
      dateCompleted = format(dateCompleted, 'yyyy-MM-dd');
    }
    if (!currentDate) {     
      currentDate = new Date();
      currentDate = format(currentDate, 'yyyy-MM-dd');
    }
    if (!valueCompleted) {
      valueCompleted = 1;
    }
    const res = await fetch(`${BACKEND_URL}/api/habits/2/complete/${habitId}`, {
      method: 'POST',
      body: JSON.stringify({
        completionDate: dateCompleted,
        currentDate,
        valueCompleted
      }),
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })
    console.log("response from toggleComplete2: ", res)
    const json = await res.json()
    console.log("json from toggleComplete2: ", json)

    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    dispatch({ type: 'TOGGLE_COMPLETE', payload: json})
    console.log("toggle complete json habit 2: ", json.habit)

    return { success: true, habit: json.habit }
  }

  const toggleComplete = async (habitId, dateCompleted) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }

    if (!dateCompleted) {
      dateCompleted = new Date();
    }

    const res = await fetch(`${BACKEND_URL}/api/habits/complete`, {
      method: 'POST',
      body: JSON.stringify({
        habitId,
        dateCompleted
      }),
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const json = await res.json()
    
    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    dispatch({ type: 'TOGGLE_COMPLETE', payload: json.habit})
    console.log("toggle complete json habit: ", json.habit)
    return { success: true, habit: json.habit }
  }

  const syncHabit2 = async (originalHabitId, currentDate) => {
    if (!user) return { success: false, error: 'You must be logged in' }
    if (!currentDate) currentDate = format(new Date(), 'yyyy-MM-dd')
    const res = await fetch (`${ BACKEND_URL }/api/habits/2/sync`, {
      method: 'POST',
      body: JSON.stringify({
        originalHabitId,
        currentDate
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })

    const json = await res.json()
    if (!res.ok) return { success: false, error: json.error }
    
    const originalHabit = await fetch(`${BACKEND_URL}/api/habits/2/${ originalHabitId }?currentDate=${currentDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
        'Access-Type': 'sync'
      }
    })
    
    const jsonOriginal = await originalHabit.json()
    
    if (!originalHabit.ok) {
      return { success: false, error: jsonOriginal.error || "Failed to fetch original habit" }
    }

    dispatch({ type: 'SYNC_HABIT', payload: {
      newHabit: json,
      originalHabit: jsonOriginal
    }})
    
    return { success: true, newHabit: json, originalHabit: jsonOriginal }
  }

  const syncHabit = async (originalHabitId, originalUserId, newPrivacy) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }

    const res = await fetch(`${BACKEND_URL}/api/habits/sync`, {
      method: 'POST',
      body: JSON.stringify({
        originalHabitId,
        originalUserId,
        privacy: newPrivacy
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    
    const json = await res.json()
    
    if (!res.ok) {
      return { success: false, error: json.error }
    }

    const originalHabit = await fetch(`${BACKEND_URL}/api/habits/${originalHabitId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
        'Access-Type': 'sync'
      }
    })
    
    const jsonOriginal = await originalHabit.json()
    
    if (!originalHabit.ok) {
      return { success: false, error: jsonOriginal.error || "Failed to fetch original habit" }
    }

    dispatch({ type: 'SYNC_HABIT', payload: {
      newHabit: json,
      originalHabit: jsonOriginal
    }})
    
    return { success: true, newHabit: json, originalHabit: jsonOriginal }
  }

  return { 
    getSyncedHabits, syncHabit, getHabit, getHabits, getFriendHabits, getPublicHabits, getTargetHabits, createHabit, createHabit2, deleteHabit2, getHabit2, getLinkedHabits, syncHabit2,
    updateHabit, deleteHabit, toggleComplete, toggleComplete2 }
}