"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { getProfile } from "../services/Api"

// Create the context
export const AuthContext = createContext()

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Function to load user data from localStorage and/or API
  const loadUserData = async () => {
    setLoading(true)
    try {
      // Check if we have auth data in localStorage
      const authData = JSON.parse(localStorage.getItem("authData") || "{}")
      const token = authData.token

      if (token) {
        // If we have a token, fetch the user profile from the API
        const profileData = await getProfile(token)

        if (profileData && profileData.user) {
          setUser(profileData.user)
          setIsAuthenticated(true)
        } else {
          // If API call fails, try to use data from localStorage as fallback
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
          if (storedUser && storedUser.email) {
            setUser(storedUser)
            setIsAuthenticated(true)
          } else {
            setIsAuthenticated(false)
          }
        }
      } else {
        // If no token, check if we have user data from signup
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        if (storedUser && storedUser.email) {
          setUser(storedUser)
          // User is not fully authenticated without a token
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

  // Function to handle login
  const login = (userData, token) => {
    // Store auth data in localStorage
    localStorage.setItem("authData", JSON.stringify({ token }))

    // Store user data
    localStorage.setItem("user", JSON.stringify(userData))

    // Update state
    setUser(userData)
    setIsAuthenticated(true)
  }

  // Function to handle logout
  const logout = () => {
    // Remove auth data from localStorage
    localStorage.removeItem("authData")

    // Update state
    setUser(null)
    setIsAuthenticated(false)

    // Note: We don't remove 'user' from localStorage to preserve profile data
  }

  // Function to update user data
  const updateUserData = (updatedData) => {
    // Update the user state
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }))

    // Update localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...storedUser,
        ...updatedData,
      }),
    )
  }

  // Load user data on initial render
  useEffect(() => {
    loadUserData()
  }, [])

  // The context value that will be provided
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

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

