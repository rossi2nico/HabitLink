import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {

  const { dispatch } = useAuthContext()

  const logout = () => {
    localStorage.removeItem('User')
    dispatch({ type: 'LOGOUT' })
  }
  
  return { logout }
}