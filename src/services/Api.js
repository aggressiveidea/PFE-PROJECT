import axios from "axios";

// Existing functions...
export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    console.log("Backend response:", data);
    return data;
  } catch (error) {
    console.log("Error login:", error);
    throw error;
  }
};

export const getProfile = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch("http://localhost:5000/user/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    // Get auth token from localStorage
    console.log("userId to fetch:", userId);

    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    const token = authData.token;

    console.log("userrrrrr", authData);
    console.log("user", token);
    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:5000/user/${userId}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const res = await response.json();
    console.log("userrr", res);
    return res.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const response = await fetch("http://localhost:5000/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    if (!id) {
      console.error("Update user called without ID:", { id, data });
      throw new Error("User ID is required for update");
    }

    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    const token = authData.token;

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const cleanData = {
      firstName: data.firstName,
      lastName: data.lastName,
      userBio: data.userBio || "",
    };

    if (data.role) {
      cleanData.role = data.role;
    }

    if (data.profileImgUrl && !data.profileImgUrl.includes("placeholder.svg")) {
      cleanData.profileImgUrl = data.profileImgUrl;
    }

    console.log(
      `Sending PUT request to http://localhost:5000/user/${id} with data:`,
      cleanData
    );

    const response = await fetch(`http://localhost:5000/user/${id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(cleanData),
    });

    console.log(
      "Update response status:",
      response.status,
      response.statusText
    );

    const responseData = await response.json();
    console.log("Update response data:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to update user: ${responseData.message || response.statusText}`
      );
    }

    if (responseData && responseData.success === true) {
      return responseData;
    } else {
      throw new Error(responseData.message || "Failed to update user");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updatepassword = async (id, data) => {
  try {
    const response = await fetch(`http://localhost:5000/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await fetch(
      "http://localhost:5000/auth/resend-verification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw error;
  }
};

export const getallarticles = async (index) => {
  try {
    console.log("index", index);
    const response = await fetch(
      `http://localhost:5000/articles/index?index=${index}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
    console.log("verified", data); // Debugging

    const response = await fetch("http://localhost:5000/articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // Sending FormData
    });

    console.log("idj whayyy", response);
    if (!response.ok) {
      throw new Error("Failed to add article");
    }

    const res = await response.json();
    console.log("the fetching answer", res);
    return res.data;
  } catch (error) {
    console.error("❌ Error adding article:", error);
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

export const deletearticle = async (id) => {
  try {
    const token = localStorage.getItem("token");
    console.log("the id", id);
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
    return res;
  } catch (error) {
    console.error("Error deleting article :", error);
    throw error;
  }
};

export const getTotalUsers = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/admin/total", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch total users");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching total users:", error);
    throw error;
  }
};

export const getActiveUsers = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/admin/active-users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch active users");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching active users:", error);
    throw error;
  }
};

export const getUsersByCountry = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/admin/user-country", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users by country");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching users by country:", error);
    throw error;
  }
};

export const getUserActivityPerMonth = async (token) => {
  try {
    const response = await fetch("http://localhost:5000/admin/user-activity", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user activity per month");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error fetching user activity per month:", error);
    throw error;
  }
};

export const updateUserRole = async (userId, newRole, token) => {
  try {
    if (!userId) {
      throw new Error("User ID is required for role update");
    }

    if (!token) {
      throw new Error("Authentication token is required");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const roleData = {
      role: newRole,
    };

    console.log(
      `Sending role update request to http://localhost:5000/user/role/${userId} with role: ${newRole}`
    );

    const response = await fetch(`http://localhost:5000/user/role/${userId}`, {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(roleData),
    });

    console.log(
      "Role update response status:",
      response.status,
      response.statusText
    );

    const responseData = await response.json();
    console.log("Role update response data:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to update user role: ${
          responseData.message || response.statusText
        }`
      );
    }

    return {
      success: true,
      data: responseData.data || responseData,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      message: error.message || "Failed to update user role",
    };
  }
};

export const submitExpertApplication = async (applicationData) => {
  try {
    const response = await fetch("http://localhost:5000/user/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to submit application",
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error submitting expert application:", error);
    return {
      success: false,
      message: error.message || "An error occurred during submission",
    };
  }
};

export const classicSearch = async (query, page = 1, limit = 8) => {
  try {
    const url = new URL("http://localhost:3001/api/search/classic");

    if (query) url.searchParams.append("query", query);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    console.log("Fetching from:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Search API error:", response.status, response.statusText);
      throw new Error("Failed to perform classic search");
    }

    const data = await response.json();

    // Check if the response has the expected format
    if (!data) {
      console.error("Invalid search response format:", data);
      return [];
    }

    // Handle both array and object with results property
    if (Array.isArray(data)) {
      return data;
    } else if (data.results && Array.isArray(data.results)) {
      return data.results;
    } else {
      console.error("Unexpected response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error in classic search:", error);

    return [];
  }
};

export const indexedSearch = async (
  letter,
  page = 1,
  limit = 8,
  language = "en"
) => {
  try {
    if (!letter || letter.length !== 1) {
      console.error("Invalid letter parameter:", letter);
      return [];
    }

    const url = new URL(
      `http://localhost:3001/api/search/indexed/${letter}?language=${language}`
    );
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    console.log("Fetching from:", url.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "Indexed search API error:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to perform indexed search");
    }

    const data = await response.json();

    console.log("hhhhhhhhhhhhhhhhh", data);
    // Handle both array and object with results property
    if (Array.isArray(data)) {
      return data;
    } else if (data.results && Array.isArray(data.results)) {
      return data.results;
    } else {
      console.error("Unexpected response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error in indexed search:", error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
};

export const graphSearch = async (termName, depth = 2) => {
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
      console.error(
        "Graph search API error:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to perform graph search");
    }

    const data = await response.json();

    // Check if the response has the expected format
    if (!data) {
      console.error("Invalid graph search response format:", data);
      return { nodes: [], edges: [] };
    }

    return {
      nodes: data.nodes || [],
      edges: data.links || [],
    };
  } catch (error) {
    console.error("Error in graph search:", error);
    // Return empty graph data instead of throwing to prevent UI crashes
    return { nodes: [], edges: [] };
  }
};

export const runGraphAlgorithm = async (algorithm, params = {}) => {
  try {
    if (!algorithm) {
      console.error("Missing algorithm parameter");
      throw new Error("Algorithm parameter is required");
    }

    const queryParams = new URLSearchParams(params).toString();
    const url = `http://localhost:3001/api/search/algorithms/${algorithm}?${queryParams}`;

    console.log("Fetching from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "algorithm API error:",
        response.status,
        response.statusText
      );
      throw new Error(`failed to run algorithm: ${algorithm}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error running algorithm ${algorithm}:`, error);
    throw error;
  }
};

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

// ==================== GRAPH PROJECTIONS API ====================

/**
 * Get all available graph projections
 */
export const getGraphProjections = async () => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/graph-projections",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch graph projections");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching graph projections:", error);
    throw error;
  }
};

/**
 * Create a new graph projection
 */
export const createGraphProjection = async (projectionData) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/graph-projections",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectionData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create graph projection");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating graph projection:", error);
    throw error;
  }
};

/**
 * Drop a graph projection
 */
export const dropGraphProjection = async (graphName) => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/graph-projections/${graphName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to drop graph projection");
    }

    return await response.json();
  } catch (error) {
    console.error("Error dropping graph projection:", error);
    throw error;
  }
};

/**
 * Create a complete graph projection
 */
export const createCompleteProjection = async (language = "en") => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/graph-projections/complete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create complete projection");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating complete projection:", error);
    throw error;
  }
};

/**
 * Create a category-specific projection
 */
export const createCategoryProjection = async (
  categoryName,
  language = "en"
) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/graph-projections/category",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName, language }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create category projection");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category projection:", error);
    throw error;
  }
};

/**
 * Create a node-centric projection
 */
export const createNodeCentricProjection = async (
  nodeName,
  userId = "anonymous",
  depth = 2,
  language = "en"
) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/graph-projections/node-centric",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodeName, userId, depth, language }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create node-centric projection");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating node-centric projection:", error);
    throw error;
  }
};

// ==================== GRAPH ALGORITHMS API ====================

/**
 * Run PageRank algorithm
 */
export const runPageRank = async (graphName, config = {}) => {
  try {
    const response = await fetch("http://localhost:3001/api/gds/pagerank", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ graphName, config }),
    });

    if (!response.ok) {
      throw new Error("Failed to run PageRank algorithm");
    }

    return await response.json();
  } catch (error) {
    console.error("Error running PageRank:", error);
    throw error;
  }
};

/**
 * Run Louvain community detection algorithm
 */
export const runLouvain = async (graphName, config = {}) => {
  try {
    const response = await fetch("http://localhost:3001/api/gds/louvain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ graphName, config }),
    });

    if (!response.ok) {
      throw new Error("Failed to run Louvain algorithm");
    }

    return await response.json();
  } catch (error) {
    console.error("Error running Louvain:", error);
    throw error;
  }
};

/**
 * Run Betweenness Centrality algorithm
 */
export const runBetweennessCentrality = async (graphName, config = {}) => {
  try {
    const response = await fetch("http://localhost:3001/api/gds/betweenness", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ graphName, config }),
    });

    if (!response.ok) {
      throw new Error("Failed to run Betweenness Centrality algorithm");
    }

    return await response.json();
  } catch (error) {
    console.error("Error running Betweenness Centrality:", error);
    throw error;
  }
};

/**
 * Run Label Propagation algorithm
 */
export const runLabelPropagation = async (graphName, config = {}) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/gds/label-propagation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ graphName, config }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to run Label Propagation algorithm");
    }

    return await response.json();
  } catch (error) {
    console.error("Error running Label Propagation:", error);
    throw error;
  }
};

/**
 * Run Node Similarity algorithm
 */
export const runNodeSimilarity = async (graphName, config = {}) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/gds/node-similarity",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ graphName, config }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to run Node Similarity algorithm");
    }

    return await response.json();
  } catch (error) {
    console.error("Error running Node Similarity:", error);
    throw error;
  }
};

/**
 * Get term suggestions based on a specific term
 */
export const getTermSuggestions = async (
  graphName,
  termName,
  limit = 10,
  config = {}
) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/gds/term-suggestions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ graphName, termName, limit, config }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get term suggestions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting term suggestions:", error);
    throw error;
  }
};

/**
 * Find related terms based on a specific term
 */
export const findRelatedTerms = async (graphName, termName, limit = 10) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/gds/related-terms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ graphName, termName, limit }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to find related terms");
    }

    return await response.json();
  } catch (error) {
    console.error("Error finding related terms:", error);
    throw error;
  }
};

/**
 * Find interdisciplinary terms
 */
export const findInterdisciplinaryTerms = async (graphName, config = {}) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/gds/interdisciplinary-terms",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ graphName, config }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to find interdisciplinary terms");
    }

    return await response.json();
  } catch (error) {
    console.error("Error finding interdisciplinary terms:", error);
    throw error;
  }
};

/**
 * Find key legal concepts
 */
export const findKeyLegalConcepts = async (graphName, config = {}) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/gds/key-legal-concepts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ graphName, config }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to find key legal concepts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error finding key legal concepts:", error);
    throw error;
  }
};

/**
 * Find semantic clusters
 */
export const findSemanticClusters = async (graphName, config = {}) => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/gds/semantic-clusters",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ graphName, config }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to find semantic clusters");
    }

    return await response.json();
  } catch (error) {
    console.error("Error finding semantic clusters:", error);
    throw error;
  }
};

// ==================== SEARCH HISTORY API ====================

/**
 * Get search history for a user
 */
export const getSearchHistory = async (userId, limit = 50) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3001/api/search-history/${userId}?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch search history");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching search history:", error);
    throw error;
  }
};

/**
 * Add a search history entry
 */
export const addSearchHistory = async (historyData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/api/search-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(historyData),
    });

    if (!response.ok) {
      throw new Error("Failed to add search history");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding search history:", error);
    throw error;
  }
};

/**
 * Clear search history for a user
 */
export const clearSearchHistory = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:3001/api/search-history/${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to clear search history");
    }

    return await response.json();
  } catch (error) {
    console.error("Error clearing search history:", error);
    throw error;
  }
};

// Existing API functions continue...
export const fetchQuizQuestions = async (level) => {
  try {
    // Map our level to Open Trivia DB difficulty
    const difficulty = level.toLowerCase();

    // Fetch questions from API
    const response = await fetch(
      `https://opentdb.com/api.php?amount=5&category=18&difficulty=${difficulty}&type=multiple`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }

    const data = await response.json();

    if (
      data.response_code !== 0 ||
      !data.results ||
      data.results.length === 0
    ) {
      console.warn(
        "API returned an error or no questions, using fallback questions"
      );
      return getFallbackQuestions(level);
    }

    // Format questions
    return data.results.map((q) => {
      // Combine correct and incorrect answers and shuffle
      const options = [...q.incorrect_answers, q.correct_answer].sort(
        () => Math.random() - 0.5
      );

      return {
        question: q.question,
        options: options,
        correctAnswer: q.correct_answer,
      };
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return getFallbackQuestions(level);
  }
};

// Enhanced fallback questions with more options for each difficulty level
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
        question:
          "What file extension is used for Microsoft Excel spreadsheets?",
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
        options: [
          "Universal Serial Bus",
          "United Serial Bus",
          "Universal System Bus",
          "Unified Serial Bus",
        ],
        correctAnswer: "Universal Serial Bus",
      },
      {
        question:
          "Which of these is used to store data permanently in a computer?",
        options: ["Hard Disk Drive", "RAM", "CPU", "ROM"],
        correctAnswer: "Hard Disk Drive",
      },
      {
        question: "What is the main function of an email client?",
        options: [
          "Send and receive emails",
          "Browse the internet",
          "Edit documents",
          "Play games",
        ],
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
        correctAnswer:
          "Monitor and control incoming and outgoing network traffic",
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
        question:
          "Which programming language is commonly used for web development?",
        options: ["JavaScript", "C++", "Swift", "COBOL"],
        correctAnswer: "JavaScript",
      },
      {
        question: "What is the purpose of CSS in web development?",
        options: [
          "Style and layout of web pages",
          "Server-side processing",
          "Database management",
          "Network security",
        ],
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
        question:
          "Which protocol is used to secure communication between a web browser and a website?",
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
        correctAnswer:
          "Establish a protected network connection when using public networks",
      },
      {
        question: "Which of these is a NoSQL database?",
        options: ["MongoDB", "MySQL", "PostgreSQL", "Oracle"],
        correctAnswer: "MongoDB",
      },
      {
        question:
          "What is the difference between symmetric and asymmetric encryption?",
        options: [
          "Asymmetric uses different keys for encryption and decryption",
          "Symmetric is always more secure",
          "Asymmetric is always faster",
          "Symmetric uses multiple keys for the same message",
        ],
        correctAnswer:
          "Asymmetric uses different keys for encryption and decryption",
      },
      {
        question: "What is a RESTful API?",
        options: [
          "An architectural style for designing networked applications",
          "A programming language for artificial intelligence",
          "A type of database management system",
          "A security protocol for wireless networks",
        ],
        correctAnswer:
          "An architectural style for designing networked applications",
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
        question:
          "Which of these is a principle of object-oriented programming?",
        options: [
          "Encapsulation",
          "Fragmentation",
          "Centralization",
          "Normalization",
        ],
        correctAnswer: "Encapsulation",
      },
      {
        question:
          "What is the purpose of a load balancer in a server architecture?",
        options: [
          "Distribute network traffic across multiple servers",
          "Increase storage capacity",
          "Encrypt sensitive data",
          "Compress large files",
        ],
        correctAnswer: "Distribute network traffic across multiple servers",
      },
    ],
  };
  const levelQuestions = questions[level.toLowerCase()] || questions.medium;

  return levelQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
};

//hadi for books les loulous

const API_BASE_URL = "http://localhost:5000";

// Get all books
export const getBooks = async () => {
  try {
    console.log("API: Fetching books...");
    const response = await axios.get(`${API_BASE_URL}/books`);
    console.log("API: Books fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("API: Error fetching books:", error);
    throw error;
  }
};
export const createNewBook = async (bookData) => {
  try {
    console.log("API: Creating new book...");

    const isFormData = bookData instanceof FormData;

    const headers = isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

    console.log("API: Using headers:", headers);
    console.log("API: Is FormData:", isFormData);

    const response = await axios.post(`${API_BASE_URL}/books`, bookData, {
      headers,
    });

    console.log("API: Book created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "API: Error creating book:",
      error.response?.data || error.message
    );
    throw error;
  }
};
/**
 * Request a password reset email
 * @param {string} email - User's email address
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const requestPasswordReset = async (email) => {
  try {
    console.log("Requesting password reset for:", email);

    const response = await fetch("http://localhost:5000/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("Password reset request response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to request password reset");
    }

    return {
      success: true,
      message: data.message || "Password reset instructions sent",
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

/**
 * Verify if a password reset link is valid
 * @param {string} userId - The user ID
 * @returns {Promise<{isValid: boolean, userId: string, message: string}>}
 */
export const verifyResetLink = async (userId) => {
  try {
    console.log("Verifying reset link for user:", userId);

    // Check if parameter exists
    if (!userId) {
      console.error("Missing userId");
      return { isValid: false, message: "Reset link is incomplete" };
    }

    const response = await fetch(
      `http://localhost:5000/auth/verify-reset?id=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => {
      console.error("Network error when verifying reset link:", error);
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Reset link verification failed:", data);
      return { isValid: false, message: data.message || "Invalid reset link" };
    }

    return {
      isValid: true,
      userId: data.data?.userId || userId,
      message: "Reset link is valid",
    };
  } catch (error) {
    console.error("Error verifying reset link:", error);
    return {
      isValid: false,
      message: error.message || "Error verifying reset link",
    };
  }
};

/**
 * Reset password with user ID
 * @param {string} userId - The user ID
 * @param {string} password - The new password
 * @returns {Promise<{success: boolean, data: any}>}
 */
export const resetPassword = async (userId, password) => {
  try {
    console.log("Resetting password for user:", userId);

    const response = await fetch(
      `http://localhost:5000/auth/reset-password/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const data = await response.json();
    console.log("Reset password response:", data);

    if (!response.ok) {
      console.error("Password reset failed:", data);
      throw new Error(data.message || "Failed to reset password");
    }

    // Clear any stored auth data to ensure user is logged out
    localStorage.removeItem("authData");
    localStorage.removeItem("user");

    return { success: true, data };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const toparticles = async () => {
  try {
    const response = await fetch(`http://localhost:5000/articles/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to bring article");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error in article :", error);
    throw error;
  }
};
export const topauthors = async () => {
  try {
    const response = await fetch(`http://localhost:5000/user/author`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to bring users");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Error in article :", error);
    throw error;
  }
};

export const GetAllMessages = async (id) => {
  try {
    console.log("id ", id);
    const response = await fetch(`http://localhost:5000/chat/article/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all messages");
    }

    // Parse the JSON body
    const result = await response.json();
    console.log("Parsed response:", result);

    // Check if the response has the expected structure
    if (result.success && Array.isArray(result.data)) {
      console.log("Messages array:", result.data);
      return result.data;
    } else {
      console.error("Unexpected response format:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// First, let's fix the sendMessage function:
export const sendMessage = async (id, data) => {
  try {
    console.log("Sending message for article:", id);
    const response = await fetch(`http://localhost:5000/chat/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`);
    }

    // Parse the JSON body
    const result = await response.json();
    console.log("Message sent successfully:", result);

    if (result && result.success && result.data) {
      return result;
    } else {
      console.error("Unexpected response format:", result);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getUnverifiedMessages = async () => {
  try {
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
  try {
    const response = await fetch(`http://localhost:5000/chat/message/${id}`, {
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
  try {
    console.log("iddd", id);
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

export const approveMessage = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/chat/approve/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to approve message");

    const result = await response.json();

    if (result?.success) return result;
    throw new Error("Approval failed");
  } catch (error) {
    console.error("Error approving message:", error);
    throw error;
  }
};


export const approveArticle = async (id) => {
  try {
    console.log("...........", id);
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5000/articles//notif/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to approve article");
    }

    const res = await response.json();
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error approuving article :", error);
    throw error;
  }
};

export const commentCounter = async (id) => {
  try {
    const token = localStorage.getItem("token");

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
  try {
    console.log(id);
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/articles/favor/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("result", result);

    if (response.success === "true")
      throw new Error("Failed to update favor counter");
    console.log(result);
    return result.success;
  } catch (error) {
    console.error("Error updating favor counter:", error);
    throw error;
  }
};

export const shareCounter = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/articles/share/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // No body content needed in the request
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
  try {
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
    const response = await fetch(`http://localhost:5000/user/favorites/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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

    console.log("hellllooooo", result?.success);
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

export const getownerswritng = async ( ownerId ) =>
{
  console.log("iddd",ownerId);
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/articles/owner/${ownerId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch owner's articles");
  }

  const result = await response.json();
  return result.data;
};

export const getCategoryDetails = async () => {
  console.log("hiiiiii");
};

export const fetchQuizQuestions2 = async () => {
  console.log("shiiiitttt");
};

export const loginUserOrg = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    console.log("Backend response:", data);
    return data;
  } catch (error) {
    console.log("Error login:", error);
    throw error;
  }
};