export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    return await response.json()
  } catch (error) {
    console.error("error registering user:", error)
    throw error
  }
}
export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Failed to login")
    }

    const data = await response.json()
    console.log("Backend response:", data)
    return data
  } catch (error) {
    console.log("Error login:", error)
    throw error
  }
}

export const getProfile = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch profile")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching profile:", error)
    throw error
  }
}
export const getAllUsers = async () => {
  try {
    const response = await fetch("http://localhost:5000/user/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch all users")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}
export const getUserById = async (userId) => {
  try {
    // Get auth token from localStorage
    console.log("userId to fetch:", userId);

    const authData = JSON.parse(localStorage.getItem("authData") || "{}")
    const token = authData.token

       console.log("userrrrrr", authData);
       console.log("user", token);
    const headers = {
      "Content-Type": "application/json",
    }

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`http://localhost:5000/user/${userId}`, {
      method: "GET",
      headers: headers,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user data")
    }

    const res = await response.json()
    console.log("userrr", res)
    return res.data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

export const createUser = async (data) => {
  try {
    const response = await fetch("http://localhost:5000/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create user")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const updateUser = async (id, data) => {
  try {
    if (!id) {
      console.error("Update user called without ID:", { id, data })
      throw new Error("User ID is required for update")
    }

    const authData = JSON.parse(localStorage.getItem("authData") || "{}")
    const token = authData.token

    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const cleanData = {
      firstName: data.firstName,
      lastName: data.lastName,
      userBio: data.userBio || "",
    }

    if (data.role) {
      cleanData.role = data.role
    }

    if (data.profileImgUrl && !data.profileImgUrl.includes("placeholder.svg")) {
      cleanData.profileImgUrl = data.profileImgUrl
    }

    console.log(`Sending PUT request to http://localhost:5000/user/${id} with data:`, cleanData)

    const response = await fetch(`http://localhost:5000/user/${id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(cleanData),
    })

    console.log("Update response status:", response.status, response.statusText)

    const responseData = await response.json()
    console.log("Update response data:", responseData)

    if (!response.ok) {
      throw new Error(`Failed to update user: ${responseData.message || response.statusText}`)
    }

    if (responseData && responseData.success === true) {
      return responseData
    } else {
      throw new Error(responseData.message || "Failed to update user")
    }
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete user")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}
export const updatepassword = async (id, data) => {
  try {
    const response = await fetch(`http://localhost:5000/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update user")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}
export const resendVerificationEmail = async (email) => {
  try {
    const response = await fetch("http://localhost:5000/auth/resend-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error resending verification email:", error)
    throw error
  }
}
export const getallarticles = async (index) => {
  try
  {
    console.log("index", index)
    const response = await fetch(`http://localhost:5000/articles/index?index=${index}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get all of the articles")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error getting in article :", error)
    throw error
  }
}
export const getArticleById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/articles/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get all of the articles")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error getting in article :", error)
    throw error
  }
}
export const getarticlebytitle = async (title) => {
  try {
    const response = await fetch(`http://localhost:5000/articles/title?title=${title}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get articles by title")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error getting in article :", error)
    throw error
  }
}
export const getarticlebycat = async (category, limit) => {
  try {
    const response = await fetch(`http://localhost:5000/articles/category?category=${category}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get articles by category")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error getting in article :", error)
    throw error
  }
}
export const getarticlbBylang = async (language) => {
  try {
    const response = await fetch(`http://localhost:5000/articles/language?language=${language}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to get articles by language")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error getting in article :", error)
    throw error
  }
}
export const addArticle = async (data) => {
  try {
    const token = localStorage.getItem("token");
    console.log( data );// Debugging

    const response = await fetch("http://localhost:5000/articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // Sending FormData
    });

    if (!response.ok) {
      throw new Error("Failed to add article");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("❌ Error adding article:", error);
    throw error;
  }
};
export const updatearticle = async (id, data) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:5000/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to update article")
    }

    const res = await response.json()
    return res
  } catch (error) {
    console.error("Error updating article :", error)
    throw error
  }
}
export const deletearticle = async (id) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`http://localhost:5000/articles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    } )

    if (!response.ok) {
      throw new Error( "Failed to delete article" )
      
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error deleting article :", error)
    throw error
  }
}
export const getTotalUsers = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/admin/total", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch total users")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error fetching total users:", error)
    throw error
  }
}

export const getActiveUsers = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/admin/active-users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch active users")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error fetching active users:", error)
    throw error
  }
}

export const getUsersByCountry = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/admin/user-country", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users by country")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error fetching users by country:", error)
    throw error
  }
}

export const getUserActivityPerMonth = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/admin/user-activity", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user activity per month")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error fetching user activity per month:", error)
    throw error
  }
}
export const updateUserRole = async (userId, newRole, token) => {
  try {
    if (!userId) {
      throw new Error("User ID is required for role update")
    }

    if (!token) {
      throw new Error("Authentication token is required")
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }

  
    const roleData = {
      role: newRole,
    }

    console.log(`Sending role update request to http://localhost:5000/user/role/${userId} with role: ${newRole}`)

    const response = await fetch(`http://localhost:5000/user/role/${userId}`, {
      method: "PATCH", 
      headers: headers,
      body: JSON.stringify(roleData),
    })

    console.log("Role update response status:", response.status, response.statusText)

    const responseData = await response.json()
    console.log("Role update response data:", responseData)

    if (!response.ok) {
      throw new Error(`Failed to update user role: ${responseData.message || response.statusText}`)
    }

    return {
      success: true,
      data: responseData.data || responseData,
    }
  } catch (error) {
    console.error("Error updating user role:", error)
    return {
      success: false,
      message: error.message || "Failed to update user role",
    }
  }
}
export const submitExpertApplication = async (applicationData) => {
  try {
    const response = await fetch("http://localhost:5000/user/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to submit application",
      }
    }

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    console.error("Error submitting expert application:", error)
    return {
      success: false,
      message: error.message || "An error occurred during submission",
    }
  }
}




