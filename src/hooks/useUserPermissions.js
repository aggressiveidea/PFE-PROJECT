import { useState, useEffect } from "react"

export const useUserPermissions = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserData = () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking user data:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUserData()

    const handleUserUpdate = () => {
      checkUserData()
    }

    window.addEventListener("userUpdated", handleUserUpdate)
    return () => {
      window.removeEventListener("userUpdated", handleUserUpdate)
    }
  }, [])

  const hasRole = (allowedRoles) => {
    if (!user || !user.role) return false

    const userRole = user.role.toLowerCase()
    return allowedRoles.some((role) => role.toLowerCase() === userRole)
  }

  const canAddBooks = () => {
    return hasRole(["Content Admin", "ICT Expert", "content-admin", "ict-expert"])
  }

  return {
    user,
    loading,
    hasRole,
    canAddBooks,
    isLoggedIn: !!user,
    isVerified: user?.isVerified || false,
  }
}
