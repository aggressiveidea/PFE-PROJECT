import { createContext, useState, useEffect, useContext } from "react"
import { getProfile } from "../services/Api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const loadUserData = async () => {
    setLoading(true)
    try {
      const authData = JSON.parse(localStorage.getItem("authData") || "{}")
      const token = authData.token

      if (token) {
        const profileData = await getProfile(token)

        if (profileData && profileData.user) {
          setUser(profileData.user)
          setIsAuthenticated(true)
        } else {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
          if (storedUser && storedUser.email) {
            setUser(storedUser)
            setIsAuthenticated(true)
          } else {
            setIsAuthenticated(false)
          }
        }
      } else {
    
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        if (storedUser && storedUser.email) {
          setUser(storedUser)
  
          setIsAuthenticated(false)
        } else {
          setIsAuthenticated(false)
        }
      }
    } catch (err) {
      console.error("Error loading user data:", err)
      setError(err.message || "Failed to load user data")
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData, token) => {
    localStorage.setItem("authData", JSON.stringify({ token }))
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }
  const logout = () => {
    localStorage.removeItem("authData")
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUserData = (updatedData) => {
    
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }))


    const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        ...updatedData,
      }),
    )
  }

  useEffect(() => {
    loadUserData()
  }, [])


  const contextValue = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUserData,
    refreshUserData: loadUserData,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

