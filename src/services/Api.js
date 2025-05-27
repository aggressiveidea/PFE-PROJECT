import axios from "axios"

export const fetchGraphData = async (limit = 100) => {
  try {
    let allNodes = [];
    let allRelationships = [];
    let offset = 0;
    let hasMore = true;
    
    console.log("Starting to fetch all graph data with pagination...");

    while (hasMore) {
      console.log(`Fetching data batch with offset ${offset}, limit ${limit}...`);
      
      const response = await fetch(`http://localhost:3001/api/graph?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch graph data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || !data.nodes) {
        console.error("Invalid data format received:", data);
        break;
      }
      
      console.log(`Received ${data.nodes.length} nodes and ${data.relationships?.length || 0} relationships`);

      allNodes = [...allNodes, ...data.nodes];
      allRelationships = [...allRelationships, ...(data.relationships || [])];
 
      hasMore = data.metadata?.hasMore || false;

      offset += limit;

      if (allNodes.length >= (data.metadata?.totalCount || 0)) {
        hasMore = false;
      }

      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log(`Completed fetching all data: ${allNodes.length} nodes, ${allRelationships.length} relationships`);
    
    return {
      nodes: allNodes,
      relationships: allRelationships,
      totalCount: allNodes.length
    };
  } catch (error) {
    console.error("Error fetching graph data:", error);
    throw error;
  }
};

export const searchGraphByTerm = async (termName, depth = 2) => {
  try {
    if (!termName) {
      console.error("Missing term name parameter");
      return { nodes: [], edges: [] };
    }

    const url = new URL("http://localhost:3001/api/search/graph");
    url.searchParams.append("term", termName);
    url.searchParams.append("depth", depth.toString());

    console.log("Fetching from:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Graph search API error:", response.status, response.statusText);
      throw new Error("Failed to perform graph search");
    }

    const data = await response.json();
    if (!data) {
      console.error("Invalid graph search response format:", data);
      return { nodes: [], edges: [] };
    }

    return {
      nodes: data.nodes || [],
      edges: data.links || data.relationships || [],
    };
  } catch (error) {
    console.error("Error in graph search:", error);

    return { nodes: [], edges: [] };
  }
};

export const expandNode = async (nodeId, depth = 1) => {
  try {
    if (!nodeId) {
      console.error("Missing node ID parameter");
      return { nodes: [], edges: [] };
    }

    const response = await fetch(`http://localhost:3001/api/graph/expand/${nodeId}?depth=${depth}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Node expansion API error:", response.status, response.statusText);
      throw new Error("Failed to expand node");
    }

    const data = await response.json();

    return {
      nodes: data.nodes || [],
      edges: data.relationships || data.links || [],
    };
  } catch (error) {
    console.error("Error expanding node:", error);
    return { nodes: [], edges: [] };
  }
};

// Get node details
export const getNodeDetails = async (nodeId) => {
  try {
    if (!nodeId) {
      console.error("Missing node ID parameter");
      return null;
    }

    const response = await fetch(`http://localhost:3001/api/graph/node/${nodeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Node details API error:", response.status, response.statusText);
      throw new Error("Failed to get node details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching node details:", error);
    return null;
  }
};
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

export const loginUserOrg = async (email, password) => {
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
 
    console.log("userId to fetch:", userId)

    const authData = JSON.parse(localStorage.getItem("authData") || "{}")
    const token = authData.token

    console.log("userrrrrr", authData)
    console.log("user", token)
    const headers = {
      "Content-Type": "application/json",
    }

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
  try {
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
    const token = localStorage.getItem("token")
    console.log("verified", data) // Debugging

    const response = await fetch("http://localhost:5000/articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), 
    })

    console.log("idj whayyy", response)
    if (!response.ok) {
      throw new Error("Failed to add article")
    }

    const res = await response.json()
    console.log("the fetching answer", res)
    return res.data
  } catch (error) {
    console.error("❌ Error adding article:", error)
    throw error
  }
}

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
    const token = localStorage.getItem( "token" )
    console.log("the id",id)
    const response = await fetch(`http://localhost:5000/articles/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete article")
    }

    const res = await response.json()
    return res
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

export const classicSearch = async (query, page = 1, limit = 8) => {
  try {
    const url = new URL("http://localhost:3001/api/search/classic")

    if (query) url.searchParams.append("query", query)
    url.searchParams.append("page", page.toString())
    url.searchParams.append("limit", limit.toString())

    console.log("Fetching from:", url.toString())

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Search API error:", response.status, response.statusText)
      throw new Error("Failed to perform classic search")
    }

    const data = await response.json()

  
    if (!data) {
      console.error("Invalid search response format:", data)
      return []
    }

    if (Array.isArray(data)) {
      return data
    } else if (data.results && Array.isArray(data.results)) {
      return data.results
    } else {
      console.error("Unexpected response format:", data)
      return []
    }
  } catch (error) {
    console.error("Error in classic search:", error)

    return []
  }
}

export const indexedSearch = async (letter, page = 1, limit = 8,language = "en") => {
  try {
    if (!letter || letter.length !== 1) {
      console.error("Invalid letter parameter:", letter)
      return []
    }

    const url = new URL(
      `http://localhost:3001/api/search/indexed/${letter}/language=${language}`
    );
    url.searchParams.append("page", page.toString())
    url.searchParams.append("limit", limit.toString())

    console.log("Fetching from:", url.toString())

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Indexed search API error:", response.status, response.statusText)
      throw new Error("Failed to perform indexed search")
    }

    const data = await response.json()
    if (Array.isArray(data)) {
      return data
    } else if (data.results && Array.isArray(data.results)) {
      return data.results
    } else {
      console.error("Unexpected response format:", data)
      return []
    }
  } catch (error) {
    console.error("Error in indexed search:", error)

    return []
  }
}

export const graphSearch = async (termName, depth = 2) => {
  try {
    if (!termName) {
      console.error("Missing term name parameter")
      return { nodes: [], edges: [] }
    }

    const url = new URL("http://localhost:3001/api/search/graph")
    url.searchParams.append("term", termName)
    url.searchParams.append("depth", depth.toString())

    console.log("Fetching from:", url.toString())

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Graph search API error:", response.status, response.statusText)
      throw new Error("Failed to perform graph search")
    }

    const data = await response.json()

    if (!data) {
      console.error("Invalid graph search response format:", data)
      return { nodes: [], edges: [] }
    }

    return {
      nodes: data.nodes || [],
      edges: data.links || [],
    }
  } catch (error) {
    console.error("Error in graph search:", error)

    return { nodes: [], edges: [] }
  }
}

export const runGraphAlgorithm = async (algorithm, params = {}) => {
  try {
    if (!algorithm) {
      console.error("Missing algorithm parameter")
      throw new Error("Algorithm parameter is required")
    }

    const queryParams = new URLSearchParams(params).toString()
    const url = `http://localhost:3001/api/search/algorithms/${algorithm}?${queryParams}`

    console.log("Fetching from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("algorithm API error:", response.status, response.statusText)
      throw new Error(`failed to run algorithm: ${algorithm}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error running algorithm ${algorithm}:`, error)
    throw error
  }
}
export const getAllterms = async (language) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/search/all?language=${language}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("failed to fetch all terms");
    }

    
    return await response.json();
  } catch (error) {
    console.error("error fetching terms:", error);
    throw error;
  }
};
export const fetchQuizQuestions = async (level) => {
  try {
 
    const difficulty = level.toLowerCase()

    const response = await fetch(
      `https://opentdb.com/api.php?amount=5&category=18&difficulty=${difficulty}&type=multiple`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch questions")
    }

    const data = await response.json()

    if (data.response_code !== 0 || !data.results || data.results.length === 0) {
      console.warn("API returned an error or no questions, using fallback questions")
      return getFallbackQuestions(level)
    }

    return data.results.map((q) => {
  
      const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)

      return {
        question: q.question,
        options: options,
        correctAnswer: q.correct_answer,
      }
    })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return getFallbackQuestions(level)
  }
}


export const getFallbackQuestions = (level) => {
  const questions = {
    easy: [
      {
        question: "What does CPU stand for?",
        options: [
          "Central Processing Unit",
          "Computer Personal Unit",
          "Central Process Utility",
          "Central Processor Unifier",
        ],
        correctAnswer: "Central Processing Unit",
      },
      {
        question: "Which of these is a type of computer memory?",
        options: ["RAM", "MAP", "TAP", "SAP"],
        correctAnswer: "RAM",
      },
      {
        question: "What does URL stand for?",
        options: [
          "Uniform Resource Locator",
          "Universal Resource Link",
          "Unified Resource Locator",
          "Universal Resource Locator",
        ],
        correctAnswer: "Uniform Resource Locator",
      },
      {
        question: "Which of these is an input device?",
        options: ["Keyboard", "Monitor", "Printer", "Speaker"],
        correctAnswer: "Keyboard",
      },
      {
        question: "What file extension is used for Microsoft Excel spreadsheets?",
        options: [".xlsx", ".docx", ".pptx", ".txt"],
        correctAnswer: ".xlsx",
      },
      {
        question: "What does PDF stand for?",
        options: [
          "Portable Document Format",
          "Personal Document File",
          "Printable Document Form",
          "Published Document Format",
        ],
        correctAnswer: "Portable Document Format",
      },
      {
        question: "Which company developed the Windows operating system?",
        options: ["Microsoft", "Apple", "Google", "IBM"],
        correctAnswer: "Microsoft",
      },
      {
        question: "What does USB stand for?",
        options: ["Universal Serial Bus", "United Serial Bus", "Universal System Bus", "Unified Serial Bus"],
        correctAnswer: "Universal Serial Bus",
      },
      {
        question: "Which of these is used to store data permanently in a computer?",
        options: ["Hard Disk Drive", "RAM", "CPU", "ROM"],
        correctAnswer: "Hard Disk Drive",
      },
      {
        question: "What is the main function of an email client?",
        options: ["Send and receive emails", "Browse the internet", "Edit documents", "Play games"],
        correctAnswer: "Send and receive emails",
      },
    ],
    medium: [
      {
        question: "What is the function of an operating system?",
        options: [
          "Manage computer hardware and software resources",
          "Create documents and spreadsheets",
          "Browse the internet",
          "Play video games",
        ],
        correctAnswer: "Manage computer hardware and software resources",
      },
      {
        question: "Which of these is a cloud storage service?",
        options: ["Dropbox", "Firefox", "Photoshop", "Excel"],
        correctAnswer: "Dropbox",
      },
      {
        question: "What does HTML stand for?",
        options: [
          "Hypertext Markup Language",
          "Hypertext Markdown Language",
          "Hypertext Machine Language",
          "Hyperlink Text Markup Language",
        ],
        correctAnswer: "Hypertext Markup Language",
      },
      {
        question: "Which of these is a database management system?",
        options: ["MySQL", "Windows", "Chrome", "Photoshop"],
        correctAnswer: "MySQL",
      },
      {
        question: "What is the purpose of a firewall in computer networks?",
        options: [
          "Monitor and control incoming and outgoing network traffic",
          "Increase internet speed",
          "Store website data locally",
          "Convert digital signals to analog",
        ],
        correctAnswer: "Monitor and control incoming and outgoing network traffic",
      },
      {
        question: "What is the difference between HTTP and HTTPS?",
        options: [
          "HTTPS is encrypted and secure",
          "HTTP is faster than HTTPS",
          "HTTPS works only on mobile devices",
          "HTTP supports more file types",
        ],
        correctAnswer: "HTTPS is encrypted and secure",
      },
      {
        question: "Which programming language is commonly used for web development?",
        options: ["JavaScript", "C++", "Swift", "COBOL"],
        correctAnswer: "JavaScript",
      },
      {
        question: "What is the purpose of CSS in web development?",
        options: ["Style and layout of web pages", "Server-side processing", "Database management", "Network security"],
        correctAnswer: "Style and layout of web pages",
      },
      {
        question: "What is a cookie in the context of web browsing?",
        options: [
          "Small piece of data stored on the user's computer",
          "A type of computer virus",
          "A programming language",
          "A hardware component",
        ],
        correctAnswer: "Small piece of data stored on the user's computer",
      },
      {
        question: "What is the function of a router in a network?",
        options: [
          "Forward data packets between computer networks",
          "Store large amounts of data",
          "Process complex calculations",
          "Display visual information",
        ],
        correctAnswer: "Forward data packets between computer networks",
      },
    ],
    hard: [
      {
        question: "Which protocol is used to secure communication between a web browser and a website?",
        options: ["HTTPS", "FTP", "SMTP", "DHCP"],
        correctAnswer: "HTTPS",
      },
      {
        question: "What is the time complexity of a binary search algorithm?",
        options: ["O(log n)", "O(n)", "O(n²)", "O(n log n)"],
        correctAnswer: "O(log n)",
      },
      {
        question: "Which of these is NOT a programming paradigm?",
        options: [
          "Distributive Programming",
          "Object-Oriented Programming",
          "Functional Programming",
          "Procedural Programming",
        ],
        correctAnswer: "Distributive Programming",
      },
      {
        question: "What is the purpose of a VPN?",
        options: [
          "Establish a protected network connection when using public networks",
          "Increase internet speed",
          "Store large files in the cloud",
          "Convert file formats",
        ],
        correctAnswer: "Establish a protected network connection when using public networks",
      },
      {
        question: "Which of these is a NoSQL database?",
        options: ["MongoDB", "MySQL", "PostgreSQL", "Oracle"],
        correctAnswer: "MongoDB",
      },
      {
        question: "What is the difference between symmetric and asymmetric encryption?",
        options: [
          "Asymmetric uses different keys for encryption and decryption",
          "Symmetric is always more secure",
          "Asymmetric is always faster",
          "Symmetric uses multiple keys for the same message",
        ],
        correctAnswer: "Asymmetric uses different keys for encryption and decryption",
      },
      {
        question: "What is a RESTful API?",
        options: [
          "An architectural style for designing networked applications",
          "A programming language for artificial intelligence",
          "A type of database management system",
          "A security protocol for wireless networks",
        ],
        correctAnswer: "An architectural style for designing networked applications",
      },
      {
        question: "What is the purpose of normalization in database design?",
        options: [
          "Minimize data redundancy and dependency",
          "Increase processing speed",
          "Enhance graphical user interface",
          "Improve network connectivity",
        ],
        correctAnswer: "Minimize data redundancy and dependency",
      },
      {
        question: "Which of these is a principle of object-oriented programming?",
        options: ["Encapsulation", "Fragmentation", "Centralization", "Normalization"],
        correctAnswer: "Encapsulation",
      },
      {
        question: "What is the purpose of a load balancer in a server architecture?",
        options: [
          "Distribute network traffic across multiple servers",
          "Increase storage capacity",
          "Encrypt sensitive data",
          "Compress large files",
        ],
        correctAnswer: "Distribute network traffic across multiple servers",
      },
    ],
  }
  const levelQuestions = questions[level.toLowerCase()] || questions.medium

  return levelQuestions.sort(() => Math.random() - 0.5).slice(0, 5)
}
//hadi for books les loulous

const API_BASE_URL = "http://localhost:5000"

export const getBooks = async () => {
  try {
    console.log("API: Fetching books...")
    const response = await axios.get(`${API_BASE_URL}/books`)
    console.log("API: Books fetched successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("API: Error fetching books:", error)
    throw error
  }
}
export const createNewBook = async (bookData) => {
  try {
    console.log("API: Creating new book...")

    const isFormData = bookData instanceof FormData

    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" }

    console.log("API: Using headers:", headers)
    console.log("API: Is FormData:", isFormData)

    const response = await axios.post(`${API_BASE_URL}/books`, bookData, { headers })

    console.log("API: Book created successfully:", response.data)
    return response.data
  } catch (error) {
    console.error("API: Error creating book:", error.response?.data || error.message)
    throw error
  }
}
export const requestPasswordReset = async (email) => {
  try {
    console.log("Requesting password reset for:", email)

    const response = await fetch("http://localhost:5000/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()
    console.log("Password reset request response:", data)

    if (!response.ok) {
      throw new Error(data.message || "Failed to request password reset")
    }

    return { success: true, message: data.message || "Password reset instructions sent" }
  } catch (error) {
    console.error("Error requesting password reset:", error)
    throw error
  }
}

export const verifyResetLink = async (userId) => {
  try {
    console.log("Verifying reset link for user:", userId)

    if (!userId) {
      console.error("Missing userId")
      return { isValid: false, message: "Reset link is incomplete" }
    }

    const response = await fetch(`http://localhost:5000/auth/verify-reset?id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((error) => {
      console.error("Network error when verifying reset link:", error)
      throw new Error("Network error. Please check your connection and try again.")
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Reset link verification failed:", data)
      return { isValid: false, message: data.message || "Invalid reset link" }
    }

    return {
      isValid: true,
      userId: data.data?.userId || userId,
      message: "Reset link is valid",
    }
  } catch (error) {
    console.error("Error verifying reset link:", error)
    return { isValid: false, message: error.message || "Error verifying reset link" }
  }
}
export const resetPassword = async (userId, password) => {
  try {
    console.log("Resetting password for user:", userId)

    const response = await fetch(`http://localhost:5000/auth/reset-password/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })

    const data = await response.json()
    console.log("Reset password response:", data)

    if (!response.ok) {
      console.error("Password reset failed:", data)
      throw new Error(data.message || "Failed to reset password")
    }
    localStorage.removeItem("authData")
    localStorage.removeItem("user")

    return { success: true, data }
  } catch (error) {
    console.error("Error resetting password:", error)
    throw error
  }
}

export const toparticles = async () => {
  try {
    const response = await fetch(`http://localhost:5000/articles/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to bring article")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error in article :", error)
    throw error
  }
}
export const topauthors = async () => {
  try {
    const response = await fetch(`http://localhost:5000/user/author`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to bring users")
    }

    const res = await response.json()
    return res.data
  } catch (error) {
    console.error("Error in article :", error)
    throw error
  }
}

export const GetAllMessages = async (id) => {
  try {
    console.log("id ", id)
    const response = await fetch(`http://localhost:5000/chat/article/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch all messages")
    }

    const result = await response.json()
    console.log("Parsed response:", result)

    if (result.success && Array.isArray(result.data)) {
      console.log("Messages array:", result.data)
      return result.data
    } else {
      console.error("Unexpected response format:", result)
      return []
    }
  } catch (error) {
    console.error("Error fetching messages:", error)
    throw error
  }
}

export const sendMessage = async (id, data) => {
  try {
    console.log("Sending message for article:", id)
    const response = await fetch(`http://localhost:5000/chat/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`)
    }

    const result = await response.json()
    console.log("Message sent successfully:", result)

    if (result && result.success && result.data) {
      return result
    } else {
      console.error("Unexpected response format:", result)
      throw new Error("Invalid response format")
    }
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
};

export const getUnverifiedMessages = async () => {
  try
  {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/chat/unverified`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch unverified messages");
    const result = await response.json();

    if (result?.success && Array.isArray(result.data)) return result.data;
    return [];
  } catch (error) {
    console.error("Error fetching unverified messages:", error);
    throw error;
  }
};

export const GetMessageById = async (id) => {
  
}
export const DisplayGraph = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/terms/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },

    });

    if (!response.ok) throw new Error("Failed to fetch message");
    const result = await response.json();

    if (result?.success && result.data) return result.data;
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching message by ID:", error);
    throw error;
  }
};


export const deleteMessage = async (id) => {
  try
  {
    console.log("iddd",id);
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/chat/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete message");
    const result = await response.json();

    if (result?.success) return true;
    throw new Error("Delete failed");
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};


export const approveArticle = async (id) => {
  try
  {
    console.log("...........", id);
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/articles//notif/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to approve article");
    }
  
    const res = await response.json();
    console.log(res)
    return res;
  } catch (error) {
    console.error("Error approuving article :", error);
    throw error;
  }
  
};

export const commentCounter = async (id) => {
  try
  {
    const token = localStorage.getItem( "token" );

    const response = await fetch(
      `http://localhost:5000/articles/comment/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // No body content needed in the request
      }
    );

    if (!response.ok) throw new Error("Failed to update comment counter");
    const result = await response.json();

    if (result?.success) return result;
    throw new Error("Comment counter update failed");
  } catch (error) {
    console.error("Error updating comment counter:", error);
    throw error;
  }
};


export const favorCounter = async (id) => {
  try
  {
    console.log( id );
    const token = localStorage.getItem( "token" );

    const response = await fetch(`http://localhost:5000/articles/favor/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log('result', result );

    if (response.success === "true") throw new Error("Failed to update favor counter");
    console.log(result )
    return result.success;
  } catch (error) {
    console.error("Error updating favor counter:", error);
    throw error;
  }
};

export const shareCounter = async (id) => {
  try
  {
    const token = localStorage.getItem( "token" );

    const response = await fetch(`http://localhost:5000/articles/share/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.sucees) throw new Error("Failed to update share counter");
    const result = await response.json();

    if (result?.success) return result;
    throw new Error("Share counter update failed");
  } catch (error) {
    console.error("Error updating share counter:", error);
    throw error;
  }
};


export const GetUnverifiedarticle = async () => {
  try
  {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/articles/notif`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to approve article");
    const result = await response.json();

    if (result?.success && result.data) return result.data;
    throw new Error("Article approval failed");
  } catch (error) {
    console.error("Error approving article:", error);
    throw error;
  }
};


export const removeFromFavorites = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/user/favorites/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok)
      throw new Error("Failed to remove article from favorites");
    const result = await response.json();

    if (result?.success) return result;
    throw new Error("Removing favorite failed");
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

export const getFavorites = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/user/favorites/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to get favorite articles");
    const result = await response.json();

    console.log( "hellllooooo",result?.success );
    console.log("hellllooooolll", result);
    return result.favorites;
   
  } catch (error) {
    console.error("Error getting favorites:", error);
    throw error;
  }
};

export const addToFavorites = async (id, userid) => {
  try {
    const token = localStorage.getItem("token");
    console.log("iddddddd", id);
    const response = await fetch(
      `http://localhost:5000/user/favorites/${userid}/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to add article to favorites");
    const result = await response.json();

    if (result?.success) return result;
    throw new Error("Favorite action failed");
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

const quizQuestions = {
  "personal-data": [
    {
      question: "What does GDPR stand for?",
      options: [
        "General Data Protection Regulation",
        "Global Data Privacy Rules",
        "General Digital Privacy Rights",
        "Government Data Protection Rules",
      ],
      correctAnswer: "General Data Protection Regulation",
    },
    {
      question: "Which of the following is NOT a data subject right under GDPR?",
      options: ["Right to be forgotten", "Right to access", "Right to data ownership", "Right to data portability"],
      correctAnswer: "Right to data ownership",
    },
    {
      question: "What is the maximum fine for a serious infringement of GDPR?",
      options: [
        "€10 million or 2% of global turnover",
        "€20 million or 4% of global turnover",
        "€5 million or 1% of global turnover",
        "€50 million or 5% of global turnover",
      ],
      correctAnswer: "€20 million or 4% of global turnover",
    },
    {
      question: "What is a Data Protection Impact Assessment (DPIA)?",
      options: [
        "A tool to help identify and minimize data protection risks",
        "A certificate proving GDPR compliance",
        "A mandatory audit conducted by data protection authorities",
        "A financial assessment of data breach costs",
      ],
      correctAnswer: "A tool to help identify and minimize data protection risks",
    },
    {
      question: "Which principle requires personal data to be processed lawfully, fairly, and transparently?",
      options: ["Purpose limitation", "Data minimization", "Lawfulness, fairness and transparency", "Accountability"],
      correctAnswer: "Lawfulness, fairness and transparency",
    },
    {
      question: "What is a Data Protection Officer (DPO)?",
      options: [
        "A security guard who protects physical data centers",
        "A designated person responsible for overseeing data protection strategy and implementation",
        "A software program that automatically encrypts data",
        "A government official who inspects companies for data breaches",
      ],
      correctAnswer: "A designated person responsible for overseeing data protection strategy and implementation",
    },
    {
      question: "What does 'data minimization' refer to in data protection?",
      options: [
        "Using the smallest possible database to store data",
        "Collecting only the personal data that is necessary for specified purposes",
        "Minimizing the number of employees who can access data",
        "Reducing the physical size of data storage devices",
      ],
      correctAnswer: "Collecting only the personal data that is necessary for specified purposes",
    },
    {
      question: "What is 'pseudonymization' in the context of GDPR?",
      options: [
        "Creating fake user profiles for testing",
        "Processing personal data so it can no longer be attributed to a specific person without additional information",
        "Using pseudonyms in online forums to protect identity",
        "Completely anonymizing all personal data",
      ],
      correctAnswer:
        "Processing personal data so it can no longer be attributed to a specific person without additional information",
    },
    {
      question: "Which of the following is a valid legal basis for processing personal data under GDPR?",
      options: [
        "Having a privacy policy",
        "Consent of the data subject",
        "Having a secure database",
        "Being a registered company",
      ],
      correctAnswer: "Consent of the data subject",
    },
    {
      question: "What is a 'subject access request'?",
      options: [
        "A request to access a specific subject in a database",
        "A request by an individual to see what personal data an organization holds about them",
        "A request to change the subject line in email communications",
        "A request to be removed from marketing subjects",
      ],
      correctAnswer: "A request by an individual to see what personal data an organization holds about them",
    },
  ],
  "e-commerce": [
    {
      question: "What is the cooling-off period for online purchases in the EU?",
      options: ["7 days", "10 days", "14 days", "30 days"],
      correctAnswer: "14 days",
    },
    {
      question: "Which of the following is NOT typically required on an e-commerce website?",
      options: ["Terms and conditions", "Privacy policy", "Customer biometric data", "Contact information"],
      correctAnswer: "Customer biometric data",
    },
    {
      question: "What is a payment gateway?",
      options: [
        "A physical terminal for credit card payments",
        "A service that authorizes credit card payments for online retailers",
        "A bank account for e-commerce businesses",
        "A type of digital wallet",
      ],
      correctAnswer: "A service that authorizes credit card payments for online retailers",
    },
    {
      question: "What does PCI DSS stand for in e-commerce?",
      options: [
        "Personal Consumer Information Data Security Standard",
        "Payment Card Industry Data Security Standard",
        "Public Commerce Information Digital Safety System",
        "Primary Card Identification Data Security System",
      ],
      correctAnswer: "Payment Card Industry Data Security Standard",
    },
    {
      question: "Which of the following is an example of an online marketplace?",
      options: ["PayPal", "Shopify", "Amazon", "Stripe"],
      correctAnswer: "Amazon",
    },
    {
      question: "What is 'cart abandonment' in e-commerce?",
      options: [
        "When a shopping cart is physically abandoned in a store",
        "When a user adds items to their online cart but leaves without completing the purchase",
        "When an e-commerce platform removes old carts from the system",
        "When a website crashes during checkout",
      ],
      correctAnswer: "When a user adds items to their online cart but leaves without completing the purchase",
    },
    {
      question: "What is a 'conversion rate' in e-commerce?",
      options: [
        "The rate at which currency is converted in international transactions",
        "The percentage of website visitors who complete a desired action (like making a purchase)",
        "The rate at which inventory is converted to sales",
        "The percentage of returns and exchanges",
      ],
      correctAnswer: "The percentage of website visitors who complete a desired action (like making a purchase)",
    },
    {
      question: "What is 'dropshipping' in e-commerce?",
      options: [
        "When packages are dropped during shipping and need to be replaced",
        "A retail fulfillment method where the store doesn't keep products in stock but transfers orders to suppliers",
        "Reducing prices drastically to clear inventory",
        "Shipping items in smaller, separate packages",
      ],
      correctAnswer:
        "A retail fulfillment method where the store doesn't keep products in stock but transfers orders to suppliers",
    },
    {
      question: "What is an 'SKU' in e-commerce?",
      options: [
        "Stock Keeping Unit - a unique identifier for each distinct product and service",
        "Secure Key Utility - a security feature for online payments",
        "Store Knowledge Update - regular updates sent to customers",
        "Standard Keyboard Utility - a tool for faster product data entry",
      ],
      correctAnswer: "Stock Keeping Unit - a unique identifier for each distinct product and service",
    },
    {
      question: "What is 'A/B testing' in e-commerce?",
      options: [
        "Testing products in groups A and B for quality control",
        "Comparing two versions of a webpage to determine which performs better",
        "Testing payment methods from different banks",
        "Alternating between different shipping carriers to test efficiency",
      ],
      correctAnswer: "Comparing two versions of a webpage to determine which performs better",
    },
  ],
  networks: [
    {
      question: "What is the main function of a router in a network?",
      options: [
        "To connect multiple devices within a local network",
        "To forward data packets between computer networks",
        "To amplify network signals",
        "To encrypt network traffic",
      ],
      correctAnswer: "To forward data packets between computer networks",
    },
    {
      question: "Which protocol is used for secure web browsing?",
      options: ["HTTP", "FTP", "HTTPS", "SMTP"],
      correctAnswer: "HTTPS",
    },
    {
      question: "What does VPN stand for?",
      options: ["Virtual Private Network", "Very Powerful Network", "Virtual Protocol Node", "Verified Public Network"],
      correctAnswer: "Virtual Private Network",
    },
    {
      question: "Which of the following is NOT a type of network topology?",
      options: ["Star", "Ring", "Pyramid", "Mesh"],
      correctAnswer: "Pyramid",
    },
    {
      question: "What is the purpose of DNS in networking?",
      options: [
        "To encrypt data packets",
        "To translate domain names to IP addresses",
        "To detect network intrusions",
        "To manage bandwidth allocation",
      ],
      correctAnswer: "To translate domain names to IP addresses",
    },
    {
      question: "What is 'latency' in networking?",
      options: [
        "The maximum data transfer rate of a network",
        "The delay before a transfer of data begins following an instruction",
        "The number of devices connected to a network",
        "The strength of a wireless signal",
      ],
      correctAnswer: "The delay before a transfer of data begins following an instruction",
    },
    {
      question: "What is a 'subnet mask' used for?",
      options: [
        "To hide the network from unauthorized users",
        "To divide an IP network into sub-networks",
        "To encrypt data packets on the network",
        "To mask the physical address of network devices",
      ],
      correctAnswer: "To divide an IP network into sub-networks",
    },
    {
      question: "What is 'QoS' in networking?",
      options: [
        "Query of Service - a way to request network information",
        "Quality of Service - technology to manage data traffic and ensure performance",
        "Quantity of Servers - a measure of network capacity",
        "Quick Operating System - a lightweight OS for network devices",
      ],
      correctAnswer: "Quality of Service - technology to manage data traffic and ensure performance",
    },
    {
      question: "What is the difference between a hub and a switch?",
      options: [
        "A hub is wireless while a switch is wired",
        "A hub broadcasts data to all connected devices while a switch sends data only to the intended recipient",
        "A hub is for home networks while a switch is for business networks only",
        "A hub connects to the internet while a switch connects to the local network only",
      ],
      correctAnswer:
        "A hub broadcasts data to all connected devices while a switch sends data only to the intended recipient",
    },
    {
      question: "What is 'VLAN' in networking?",
      options: [
        "Very Large Area Network - networks spanning multiple countries",
        "Virtual Local Area Network - a logical subnetwork that groups devices regardless of physical location",
        "Variable Latency Adaptive Network - networks that adjust to traffic conditions",
        "Verified Link Access Node - a secure connection point to a network",
      ],
      correctAnswer:
        "Virtual Local Area Network - a logical subnetwork that groups devices regardless of physical location",
    },
  ],
  cybercrime: [
    {
      question: "What is phishing?",
      options: [
        "A technique to speed up internet connection",
        "A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity",
        "A method to recover deleted data",
        "A type of encryption algorithm",
      ],
      correctAnswer: "A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity",
    },
    {
      question: "What is ransomware?",
      options: [
        "Software that tracks your online activities",
        "Malware that locks your files and demands payment for their release",
        "A tool used by law enforcement to track criminals",
        "A type of firewall",
      ],
      correctAnswer: "Malware that locks your files and demands payment for their release",
    },
    {
      question: "What is the primary purpose of the Budapest Convention?",
      options: [
        "To regulate internet service providers",
        "To combat crimes committed via the internet and computer networks",
        "To establish international data centers",
        "To standardize computer hardware",
      ],
      correctAnswer: "To combat crimes committed via the internet and computer networks",
    },
    {
      question: "What is a DDoS attack?",
      options: [
        "Data Deletion on Server attack",
        "Distributed Denial of Service attack",
        "Direct Database Overload System attack",
        "Digital Disruption of Security attack",
      ],
      correctAnswer: "Distributed Denial of Service attack",
    },
    {
      question: "What is digital forensics?",
      options: [
        "The process of recovering and investigating material found in digital devices",
        "The creation of digital signatures for legal documents",
        "The encryption of sensitive legal files",
        "The process of digitizing paper-based evidence",
      ],
      correctAnswer: "The process of recovering and investigating material found in digital devices",
    },
    {
      question: "What is 'social engineering' in cybersecurity?",
      options: [
        "Using social media platforms to spread malware",
        "Psychological manipulation to trick users into making security mistakes",
        "Creating fake social media profiles to gather intelligence",
        "Engineering software for social media platforms",
      ],
      correctAnswer: "Psychological manipulation to trick users into making security mistakes",
    },
    {
      question: "What is a 'zero-day vulnerability'?",
      options: [
        "A vulnerability that is fixed within zero days of discovery",
        "A software vulnerability unknown to those who should be interested in mitigating it",
        "A vulnerability that causes zero damage to systems",
        "The first day a new system is deployed",
      ],
      correctAnswer: "A software vulnerability unknown to those who should be interested in mitigating it",
    },
    {
      question: "What is 'credential stuffing'?",
      options: [
        "Adding fake credentials to a database",
        "An attack where stolen account credentials are tested on multiple websites",
        "Creating multiple fake accounts on a service",
        "Overloading a login system with random credentials",
      ],
      correctAnswer: "An attack where stolen account credentials are tested on multiple websites",
    },
    {
      question: "What is 'cryptojacking'?",
      options: [
        "Breaking cryptocurrency wallet encryption",
        "Unauthorized use of someone's computer to mine cryptocurrency",
        "Stealing cryptocurrency through fake exchanges",
        "Creating counterfeit cryptocurrency tokens",
      ],
      correctAnswer: "Unauthorized use of someone's computer to mine cryptocurrency",
    },
    {
      question: "What is the 'dark web'?",
      options: [
        "Websites with dark-colored themes",
        "Content on the World Wide Web that requires specific software to access and is not indexed by standard search engines",
        "Websites that are currently offline or in maintenance mode",
        "A theoretical concept for a future version of the internet",
      ],
      correctAnswer:
        "Content on the World Wide Web that requires specific software to access and is not indexed by standard search engines",
    },
  ],
  miscellaneous: [
    {
      question: "What is quantum computing?",
      options: [
        "Computing using very small (quantum-sized) computers",
        "Computing using quantum mechanical phenomena such as superposition and entanglement",
        "A theoretical computing concept that doesn't exist yet",
        "Computing that focuses on quantity over quality",
      ],
      correctAnswer: "Computing using quantum mechanical phenomena such as superposition and entanglement",
    },
    {
      question: "What is the primary concern of AI ethics?",
      options: [
        "Making AI systems more profitable",
        "Ensuring AI systems are fast and efficient",
        "Addressing the moral issues related to AI development and use",
        "Preventing AI systems from becoming sentient",
      ],
      correctAnswer: "Addressing the moral issues related to AI development and use",
    },
    {
      question: "What is edge computing?",
      options: [
        "Computing performed on cutting-edge devices",
        "Computing performed at the edge of a network, close to the data source",
        "A type of computing that only uses the edges of processing chips",
        "Computing that pushes hardware to its limits",
      ],
      correctAnswer: "Computing performed at the edge of a network, close to the data source",
    },
    {
      question: "What is the main characteristic of blockchain technology?",
      options: [
        "It requires quantum computers to function",
        "It's a centralized database managed by a single authority",
        "It's a distributed, immutable ledger",
        "It's a type of artificial intelligence",
      ],
      correctAnswer: "It's a distributed, immutable ledger",
    },
    {
      question: "What does IoT stand for?",
      options: [
        "Internet of Technology",
        "Internet of Things",
        "Integration of Technology",
        "Interconnection of Terminals",
      ],
      correctAnswer: "Internet of Things",
    },
    {
      question: "What is 'digital transformation'?",
      options: [
        "Converting physical documents to digital format",
        "The integration of digital technology into all areas of a business, changing how it operates and delivers value",
        "Transforming digital images from one format to another",
        "The process of updating old digital systems to newer versions",
      ],
      correctAnswer:
        "The integration of digital technology into all areas of a business, changing how it operates and delivers value",
    },
    {
      question: "What is 'augmented reality'?",
      options: [
        "A completely virtual environment that replaces the real world",
        "An enhanced version of reality created by adding digital information on top of real-world elements",
        "A reality show about technology advancements",
        "The use of artificial intelligence to augment human capabilities",
      ],
      correctAnswer:
        "An enhanced version of reality created by adding digital information on top of real-world elements",
    },
    {
      question: "What is 'biometric authentication'?",
      options: [
        "Using biological samples to authenticate medical records",
        "Verification of a person's identity using unique biological traits like fingerprints or facial recognition",
        "Two-factor authentication using a physical token",
        "Authentication that requires medical approval",
      ],
      correctAnswer:
        "Verification of a person's identity using unique biological traits like fingerprints or facial recognition",
    },
    {
      question: "What is 'serverless computing'?",
      options: [
        "Computing without any servers involved",
        "A cloud computing execution model where the cloud provider manages server resources dynamically",
        "Using peer-to-peer networks instead of central servers",
        "Computing performed entirely on client devices",
      ],
      correctAnswer: "A cloud computing execution model where the cloud provider manages server resources dynamically",
    },
    {
      question: "What is 'digital twin' technology?",
      options: [
        "Technology that creates digital duplicates of files for backup",
        "A virtual representation that serves as the real-time digital counterpart of a physical object or process",
        "A secondary digital identity created for privacy purposes",
        "Technology that allows identical twins to share digital resources",
      ],
      correctAnswer:
        "A virtual representation that serves as the real-time digital counterpart of a physical object or process",
    },
  ],
  "it-contract": [
    {
      question: "What is an SLA in IT contracts?",
      options: [
        "System License Agreement",
        "Service Level Agreement",
        "Software Licensing Arrangement",
        "System Liability Assessment",
      ],
      correctAnswer: "Service Level Agreement",
    },
    {
      question: "Which of the following is typically NOT included in an IT service contract?",
      options: [
        "Scope of services",
        "Payment terms",
        "Personal opinions of the service provider",
        "Termination clauses",
      ],
      correctAnswer: "Personal opinions of the service provider",
    },
    {
      question: "What is the purpose of an escrow agreement in software contracts?",
      options: [
        "To hold payments until service completion",
        "To protect the source code if the vendor goes out of business",
        "To ensure software compatibility",
        "To verify software security",
      ],
      correctAnswer: "To protect the source code if the vendor goes out of business",
    },
    {
      question: "What does EULA stand for?",
      options: [
        "End User License Agreement",
        "Extended Unlimited License Arrangement",
        "Enterprise User Legal Authorization",
        "Electronic Usage Limitation Agreement",
      ],
      correctAnswer: "End User License Agreement",
    },
    {
      question: "What is a force majeure clause in IT contracts?",
      options: [
        "A clause requiring the use of maximum computing power",
        "A clause that excuses parties from performance due to unforeseeable circumstances",
        "A clause specifying the maximum force (pressure) that hardware can withstand",
        "A clause requiring military-grade security",
      ],
      correctAnswer: "A clause that excuses parties from performance due to unforeseeable circumstances",
    },
    {
      question: "What is a 'master service agreement' (MSA) in IT contracting?",
      options: [
        "A contract that only the IT department head can sign",
        "A contract that outlines the basic terms and conditions that will govern all future contracts and work",
        "An agreement that gives one vendor master control over all IT services",
        "A service level agreement for the most critical systems",
      ],
      correctAnswer:
        "A contract that outlines the basic terms and conditions that will govern all future contracts and work",
    },
    {
      question: "What is 'indemnification' in an IT contract?",
      options: [
        "The process of identifying damages after a breach",
        "A provision where one party agrees to compensate the other for losses or damages under specified conditions",
        "Insurance coverage for IT equipment",
        "The process of determining the value of IT assets",
      ],
      correctAnswer:
        "A provision where one party agrees to compensate the other for losses or damages under specified conditions",
    },
    {
      question: "What is a 'clickwrap agreement'?",
      options: [
        "An agreement to use click-tracking software",
        "A contract where users indicate acceptance by clicking 'I agree' or similar buttons",
        "A warranty for mouse and keyboard devices",
        "An agreement that automatically renews with each click",
      ],
      correctAnswer: "A contract where users indicate acceptance by clicking 'I agree' or similar buttons",
    },
    {
      question: "What is 'acceptance testing' in IT contracts?",
      options: [
        "Testing whether users accept the terms of service",
        "The process of determining if delivered software or systems meet the specified requirements",
        "Testing if a contract will be accepted by legal departments",
        "A trial period to see if users accept a new interface",
      ],
      correctAnswer: "The process of determining if delivered software or systems meet the specified requirements",
    },
    {
      question: "What is a 'statement of work' (SOW) in IT contracting?",
      options: [
        "A formal complaint about work not completed",
        "A document that defines project-specific activities, deliverables, and timelines",
        "A statement declaring that work has been completed",
        "A worker's statement of their IT qualifications",
      ],
      correctAnswer: "A document that defines project-specific activities, deliverables, and timelines",
    },
  ],
  "intellectual-property": [
    {
      question: "What type of intellectual property protection is most appropriate for software code?",
      options: ["Trademark", "Patent", "Copyright", "Trade secret"],
      correctAnswer: "Copyright",
    },
    {
      question: "What is a patent?",
      options: [
        "A right granted to the author of original creative works",
        "A right granted for an invention that provides a new way of doing something",
        "A distinctive sign that identifies goods or services",
        "A right to use a specific domain name",
      ],
      correctAnswer: "A right granted for an invention that provides a new way of doing something",
    },
    {
      question: "What does 'fair use' refer to in copyright law?",
      options: [
        "Using copyrighted material at a fair market price",
        "A doctrine that permits limited use of copyrighted material without permission",
        "Using only a fair portion (50%) of copyrighted work",
        "Fair treatment of all copyright holders",
      ],
      correctAnswer: "A doctrine that permits limited use of copyrighted material without permission",
    },
    {
      question: "What is a Creative Commons license?",
      options: [
        "A license that completely restricts the use of creative works",
        "A public license that allows creators to communicate which rights they reserve",
        "A license exclusively for commercial use of creative works",
        "A license that puts creative works immediately into the public domain",
      ],
      correctAnswer: "A public license that allows creators to communicate which rights they reserve",
    },
    {
      question: "What is NOT protected by intellectual property laws?",
      options: ["Software algorithms", "Brand logos", "General ideas and concepts", "Musical compositions"],
      correctAnswer: "General ideas and concepts",
    },
    {
      question: "What is a 'trademark'?",
      options: [
        "Any intellectual property that is marked for trading",
        "A type of intellectual property consisting of a recognizable sign, design, or expression that identifies products or services",
        "A mark that indicates a product has been tested for quality",
        "A watermark used on digital documents",
      ],
      correctAnswer:
        "A type of intellectual property consisting of a recognizable sign, design, or expression that identifies products or services",
    },
    {
      question: "What is 'work for hire' in copyright law?",
      options: [
        "Any work done by a hired professional",
        "A work created by an employee as part of their job, or by an independent contractor under certain conditions, where the employer/commissioner owns the copyright",
        "Hiring someone to work on copyrighted material",
        "A temporary license to use copyrighted work",
      ],
      correctAnswer:
        "A work created by an employee as part of their job, or by an independent contractor under certain conditions, where the employer/commissioner owns the copyright",
    },
    {
      question: "What is 'prior art' in patent law?",
      options: [
        "Art created before the digital age",
        "Information that has been made available to the public before a given date that might be relevant to a patent's claims of originality",
        "The first draft of a design patent",
        "Artwork included in a patent application",
      ],
      correctAnswer:
        "Information that has been made available to the public before a given date that might be relevant to a patent's claims of originality",
    },
    {
      question: "What is 'trade dress' protection?",
      options: [
        "Protection for clothing designs in the fashion industry",
        "Legal protection for the visual appearance of a product or its packaging that signifies the source of the product to consumers",
        "Dress codes for trade shows and business events",
        "Protection for traditional clothing designs from cultural appropriation",
      ],
      correctAnswer:
        "Legal protection for the visual appearance of a product or its packaging that signifies the source of the product to consumers",
    },
    {
      question: "What is 'digital rights management' (DRM)?",
      options: [
        "Management of digital human rights issues online",
        "A set of access control technologies for restricting the use of proprietary hardware and copyrighted works",
        "The process of registering digital copyrights online",
        "Management of rights to digitize analog works",
      ],
      correctAnswer:
        "A set of access control technologies for restricting the use of proprietary hardware and copyrighted works",
    },
  ],
  organizations: [
    {
      question: "Which organization is responsible for developing international standards?",
      options: ["IEEE", "ISO", "IETF", "W3C"],
      correctAnswer: "ISO",
    },
    {
      question: "What does ICANN stand for?",
      options: [
        "International Committee for Assigned Network Names",
        "Internet Corporation for Assigned Names and Numbers",
        "International Council of Advanced Network Nodes",
        "Internet Committee for Allocation of Network Numbers",
      ],
      correctAnswer: "Internet Corporation for Assigned Names and Numbers",
    },
    {
      question: "Which organization developed the TCP/IP protocol suite?",
      options: [
        "IETF (Internet Engineering Task Force)",
        "ISO (International Organization for Standardization)",
        "DARPA (Defense Advanced Research Projects Agency)",
        "IEEE (Institute of Electrical and Electronics Engineers)",
      ],
      correctAnswer: "DARPA (Defense Advanced Research Projects Agency)",
    },
    {
      question: "Which organization is responsible for developing HTML standards?",
      options: ["ICANN", "W3C (World Wide Web Consortium)", "IEEE", "IETF"],
      correctAnswer: "W3C (World Wide Web Consortium)",
    },
    {
      question: "What is the primary role of ENISA?",
      options: [
        "Developing encryption standards",
        "Regulating internet service providers",
        "Enhancing cybersecurity across the EU",
        "Managing domain name registrations in Europe",
      ],
      correctAnswer: "Enhancing cybersecurity across the EU",
    },
    {
      question: "What is the primary role of the 'IETF' (Internet Engineering Task Force)?",
      options: [
        "Regulating internet service providers globally",
        "Developing and promoting voluntary Internet standards",
        "Enforcing cybersecurity laws internationally",
        "Managing domain name registrations",
      ],
      correctAnswer: "Developing and promoting voluntary Internet standards",
    },
    {
      question: "What organization maintains the Domain Name System (DNS)?",
      options: [
        "World Wide Web Consortium (W3C)",
        "Internet Corporation for Assigned Names and Numbers (ICANN)",
        "Internet Society (ISOC)",
        "International Telecommunication Union (ITU)",
      ],
      correctAnswer: "Internet Corporation for Assigned Names and Numbers (ICANN)",
    },
    {
      question: "What is the 'IEEE' best known for in the technology field?",
      options: [
        "Regulating electronic device safety",
        "Developing standards for the electronics and electrical engineering industries",
        "Providing internet services to educational institutions",
        "Manufacturing electronic components",
      ],
      correctAnswer: "Developing standards for the electronics and electrical engineering industries",
    },
    {
      question: "What is the main purpose of the 'ITU' (International Telecommunication Union)?",
      options: [
        "Manufacturing telecommunications equipment",
        "Coordinating the global telecommunications network and services",
        "Providing internet access to developing countries",
        "Training telecommunications professionals",
      ],
      correctAnswer: "Coordinating the global telecommunications network and services",
    },
    {
      question: "What organization publishes the Common Criteria for Information Technology Security Evaluation?",
      options: [
        "International Organization for Standardization (ISO)",
        "World Wide Web Consortium (W3C)",
        "Internet Engineering Task Force (IETF)",
        "Common Criteria Recognition Arrangement (CCRA)",
      ],
      correctAnswer: "Common Criteria Recognition Arrangement (CCRA)",
    },
  ],
}

export const fetchQuizQuestions2 = async (category) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const questions = quizQuestions[category]
      if (questions) {
        resolve(questions)
      } else {
        reject(new Error(`No questions found for category: ${category}`))
      }
    }, 800) 
  })
}

export const getCategoryDetails = (categoryId) => {
  const categories = {
    "personal-data": {
      name: "Personal Data",
      color: "#3b82f6",
    },
    "e-commerce": {
      name: "E-commerce",
      color: "#8b5cf6",
    },
    networks: {
      name: "Networks",
      color: "#ec4899",
    },
    cybercrime: {
      name: "Cybercrime",
      color: "#ef4444",
    },
    miscellaneous: {
      name: "Miscellaneous",
      color: "#10b981",
    },
    "it-contract": {
      name: "IT Contract",
      color: "#f59e0b",
    },
    "intellectual-property": {
      name: "Intellectual Property",
      color: "#6366f1",
    },
    organizations: {
      name: "Organizations",
      color: "#0ea5e9",
    },
  }

  return categories[categoryId] || { name: "Unknown", color: "#6b7280" }
}
