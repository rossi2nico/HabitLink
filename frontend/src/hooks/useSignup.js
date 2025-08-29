import { useAuthContext } from "./useAuthContext";
import { useState } from 'react'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;  

export const useSignup = () => {

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (rawUsername, password) => {
    
    const username = rawUsername.toLowerCase()
    setIsLoading(true);

    const res = await fetch(`${BACKEND_URL}/api/users/signup`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    })
    const json = await res.json()
    if (!res.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    else {
      localStorage.setItem('User', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })
      setIsLoading(false);
    }
  }

  return { signup, isLoading, error }
}