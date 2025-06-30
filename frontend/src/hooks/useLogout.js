import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {

  const { user, dispatch } = useAuthContext()

  const logout = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }
  
  return { logout }
}