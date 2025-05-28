import { useEffect } from "react"

export function RoleUpdateListener() {
  useEffect(() => {
    const checkRoleUpdates = () => {
      const userString = localStorage.getItem("user")
      if (!userString) return

      try {
        const userData = JSON.parse(userString)
        const userId = userData._id
        const updatedUsersString = localStorage.getItem("updatedUsers")
        if (updatedUsersString) {
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
        }
      } catch (error) {
        console.error("Error checking for role updates:", error)
      }
    }

    checkRoleUpdates()

    const interval = setInterval(checkRoleUpdates, 10000) 

    const handleRouteChange = () => {
      checkRoleUpdates()
    }

    window.addEventListener("popstate", handleRouteChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  return null
}

