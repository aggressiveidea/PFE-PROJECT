"use client"

import { useEffect } from "react"

// This component can be added to layout files to ensure role updates are detected
export function RoleUpdateListener() {
  useEffect(() => {
    // Function to check for role updates
    const checkRoleUpdates = () => {
      const userString = localStorage.getItem("user")
      if (!userString) return

      try {
        const userData = JSON.parse(userString)
        const userId = userData._id

        // Check if there's a newer version of the user data
        const updatedUsersString = localStorage.getItem("updatedUsers")
        if (updatedUsersString) {
          const updatedUsers = JSON.parse(updatedUsersString)
          const updatedUser = updatedUsers.find((user) => user._id === userId)

          // If this user has been updated and the role is different
          if (updatedUser && updatedUser.role !== userData.role) {
            // Update the user data in localStorage
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...userData,
                role: updatedUser.role,
              }),
            )

            // Trigger a role update event
            window.dispatchEvent(new Event("roleUpdated"))
          }
        }
      } catch (error) {
        console.error("Error checking for role updates:", error)
      }
    }

    // Check immediately
    checkRoleUpdates()

    // Set up interval to check periodically
    const interval = setInterval(checkRoleUpdates, 10000) // Check every 10 seconds

    // Listen for navigation events to check for updates
    const handleRouteChange = () => {
      checkRoleUpdates()
    }

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  // This component doesn't render anything
  return null
}

