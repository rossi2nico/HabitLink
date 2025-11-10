import { useState } from 'react'
import { useHabitsContext } from './useHabitsContext'
import { useAuthContext } from './useAuthContext'
import { format } from 'date-fns'
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useHabits = () => {

  const { dispatch } = useHabitsContext()
  const { user } = useAuthContext()

  const getHabit = async (habitId, currentDate) => {
    if (!user) {
      return { success: false, error: 'You must be logged in' }
    }
    if (!currentDate) {
      currentDate = format(new Date(), 'yyyy-MM-dd');
    }
    const res = await fetch(`${BACKEND_URL}/api/habits/${habitId}?currentDate=${currentDate}`, {
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

    const res = await fetch(`${BACKEND_URL}/api/habits?currentDate=${currentDate}`, {
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

  const getLinkedHabits = async (habitId) => {
    if (!user) return { success: false, error: 'You must be logged in' }
    const res = await fetch(`${BACKEND_URL}/api/habits/linkedHabits/${habitId}`, {
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

  const createHabit = async (name, privacy, startDate) => {
    if (!user) return { success: false, error: "You must be logged in" }
    if (!privacy) privacy = 0;
    if (!startDate) startDate = format(new Date(), 'yyyy-MM-dd');
    if (!name) return { success: false, error: "Habit name is required" }
    
    const habit = { name, privacy, startDate }

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

  const toggleComplete = async (habitId, dateCompleted, currentDate, valueCompleted) => {
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
    const res = await fetch(`${BACKEND_URL}/api/habits/complete/${habitId}`, {
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
    console.log("response from toggleComplete: ", res)
    const json = await res.json()
    console.log("json from toggleComplete: ", json)

    if (!res.ok) {
      return { success: false, error: json.error }
    }
    
    dispatch({ type: 'TOGGLE_COMPLETE', payload: json})
    console.log("toggle complete json habit: ", json.habit)

    return { success: true, habit: json.habit }
  }

  const linkHabit = async (originalHabitId, currentDate) => {
    if (!user) return { success: false, error: 'You must be logged in' }
    if (!currentDate) currentDate = format(new Date(), 'yyyy-MM-dd')
    const res = await fetch(`${BACKEND_URL}/api/habits/sync`, {
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
    
    // const originalHabit = await fetch(`${BACKEND_URL}/api/habits/${originalHabitId}?currentDate=${currentDate}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${user.token}`,
    //     'Access-Type': 'sync'
    //   }
    // })
    
    // const jsonOriginal = await originalHabit.json()
    
    // if (!originalHabit.ok) {
    //   return { success: false, error: jsonOriginal.error || "Failed to fetch original habit" }
    // }

    dispatch({ type: 'SYNC_HABIT', payload: {
      newHabit: json.newHabit,
      originalHabit: json.originalHabit
    }})
    
    return { success: true, newHabit: json.newHabit, originalHabit: json.originalHabit }
  }

  return { 
    linkHabit, 
    getHabit, 
    getHabits, 
    getFriendHabits, 
    getLinkedHabits, 
    createHabit, 
    deleteHabit, 
    toggleComplete 
  }
}