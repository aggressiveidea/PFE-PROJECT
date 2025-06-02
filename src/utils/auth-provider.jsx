import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext({
  user: null,
  isAdmin: false,
  isContentAdmin: false,
  isLoading: true,
  refreshUserData: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUserData = () => {
    try {
      const userString = localStorage.getItem("user")
      if (userString) {
        const userData = JSON.parse(userString)
        setUser(userData)
      }
    } catch (error) {
      console.error("Error refreshing user data:", error)
    }
  }

  useEffect(() => {
    const loadUser = () => {
      try {
        const userString = localStorage.getItem("user")
        if (userString) {
          const userData = JSON.parse(userString)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()


    const handleUserUpdate = () => loadUser()
    window.addEventListener("userUpdated", handleUserUpdate)

    window.addEventListener("roleUpdated", handleUserUpdate)

    const roleCheckInterval = setInterval(() => {
      const userString = localStorage.getItem("user")
      if (userString) {
        const userData = JSON.parse(userString)
        const userId = userData._id

        const updatedUsersString = localStorage.getItem("updatedUsers")
        if (updatedUsersString) {
          try {
            const updatedUsers = JSON.parse(updatedUsersString)
            const updatedUser = updatedUsers.find((user) => user._id === userId)

            if (updatedUser && updatedUser.role !== userData.role) {
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...userData,
                  role: updatedUser.role,
                }),
              )

              window.dispatchEvent(new Event("roleUpdated"))
            }
          } catch (error) {
            console.error("Error checking for role updates:", error)
          }
        }
      }
    }, 15000) 

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate)
      window.removeEventListener("roleUpdated", handleUserUpdate)
      clearInterval(roleCheckInterval)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("authData")
    localStorage.removeItem("token")
    setUser(null)
    window.location.href = "/signin"
  }


  const isAdmin = user?.role === "admin"
  const isContentAdmin = user?.role === "content-admin"

  const value = {
    user,
    isAdmin,
    isContentAdmin,
    isLoading,
    refreshUserData,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

