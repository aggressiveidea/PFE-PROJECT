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

    // Get auth token if available
    const authData = JSON.parse(localStorage.getItem("authData") || "{}")
    const token = authData.token

    // Prepare headers with auth token if available
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Clean up the data object to only include fields that should be updated
    const cleanData = {
      firstName: data.firstName,
      lastName: data.lastName,
      userBio: data.userBio || "",
      // Don't include email as it's typically not updatable
      // Don't include role as it's typically managed by admins
    }

    // Only include profileImgUrl if it's not the placeholder
    if (data.profileImgUrl && !data.profileImgUrl.includes("placeholder.svg")) {
      cleanData.profileImgUrl = data.profileImgUrl
    }

    console.log(`Sending PUT request to http://localhost:5000/user/${id} with data:`, cleanData)

    const response = await fetch(`http://localhost:5000/user/${id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(cleanData),
    })

    // Log the full response for debugging
    console.log("Update response status:", response.status, response.statusText)

    // Try to parse the response as JSON
    const responseData = await response.json()
    console.log("Update response data:", responseData)

    if (!response.ok) {
      throw new Error(`Failed to update user: ${responseData.message || response.statusText}`)
    }

    // Check for the success flag in the response based on your backend format
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
<<<<<<< Updated upstream

=======
export const getallarticles = async () => {
  try {
    const response = await fetch(`http://localhost:5000/articles/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get all of the articles");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error getting in article :", error);
    throw error;
  }
};
export const getArticleById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/articles/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get all of the articles");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error getting in article :", error);
    throw error;
  }
};
export const getarticlebytitle = async (title) => {
  try {
    const response = await fetch(
      `http://localhost:5000/articles/title?title=${title}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get articles by title");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error getting in article :", error);
    throw error;
  }
};
export const getarticlebycat = async (category, limit) => {
  try {
    const response = await fetch(
      `http://localhost:5000/articles/category?category=${category}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get articles by category");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error getting in article :", error);
    throw error;
  }
};
export const getarticlbBylang = async (language) => {
  try {
    const response = await fetch(
      `http://localhost:5000/articles/language?language=${language}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get articles by language");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error getting in article :", error);
    throw error;
  }
};
export const addArticle = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/articles/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
      body: data, 
    });

    if (!response.ok) {
      throw new Error("Failed to add article");
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error adding article :", error);
    throw error;
  }
};
export const updatearticle = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update article");
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error updating article :", error);
    throw error;
  }
};
export const deletearticle = async (id, token) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/articles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete article");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error deleting article :", error);
    throw error;
  }
};
>>>>>>> Stashed changes
