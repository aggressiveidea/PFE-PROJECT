import axios from "axios";

 
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
     
    console.log("userId to fetch:", userId);

    const authData = JSON.parse(localStorage.getItem("authData") || "{}");
    const token = authData.token;

    console.log("userrrrrr", authData);
    console.log("user", token);
    const headers = {
      "Content-Type": "application/json",
    };

     
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
    console.log("verified", data);  

    const response = await fetch("http://localhost:5000/articles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),  
    });

    console.log("idj whayyy", response);
    if (!response.ok) {
      throw new Error("Failed to add article");
    }

    const res = await response.json();
    console.log("the fetching answer", res);
    return res.data;
  } catch (error) {
    console.error("Error adding article:", error);
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

     
    if (!data) {
      console.error("Invalid search response format:", data);
      return [];
    }

     
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

//hadi for books les loulous

const API_BASE_URL = "http://localhost:5000";

 
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

export const verifyResetLink = async (userId) => {
  try {
    console.log("Verifying reset link for user:", userId);

     
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

     
    const result = await response.json();
    console.log("Parsed response:", result);

     
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

export const getownerswritng = async (ownerId) => {
  console.log("iddd", ownerId);
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
export const getCategoryDetails = (categoryId) => {
  const categoryMap = {
    "personal-data": {
      name: "Personal Data",
      color: "#3b82f6",
      description: "Data protection, privacy laws, and GDPR compliance",
    },
    "e-commerce": {
      name: "E-commerce",
      color: "#10b981",
      description: "Online business, digital transactions, and regulations",
    },
    networks: {
      name: "Networks",
      color: "#8b5cf6",
      description: "Network infrastructure, protocols, and communication",
    },
    cybercrime: {
      name: "Cybercrime",
      color: "#ef4444",
      description: "Digital security, computer crimes, and cyber threats",
    },
    miscellaneous: {
      name: "Miscellaneous",
      color: "#f59e0b",
      description: "Emerging technologies and digital transformation",
    },
    "it-contract": {
      name: "IT Contract",
      color: "#06b6d4",
      description: "Technology agreements and service contracts",
    },
    "intellectual-property": {
      name: "Intellectual Property",
      color: "#ec4899",
      description: "Patents, copyrights, and digital IP protection",
    },
    organizations: {
      name: "Organizations",
      color: "#84cc16",
      description: "IT governance and regulatory organizations",
    },
  };

  return (
    categoryMap[categoryId] || {
      name: "Unknown Category",
      color: "#6b7280",
      description: "Category description not available",
    }
  );
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const fetchQuizQuestions2 = async (category) => {
  try {
    const questionBank = {
      "personal-data": [
        {
          question: "What is a 'subscriber' in telecommunications law?",
          options: [
            "A person who owns telecommunications equipment",
            "Any natural or legal person who has concluded a contract with a telecommunications service provider",
            "An employee of a telecommunications company",
            "A government regulator of telecommunications",
          ],
          correctAnswer:
            "Any natural or legal person who has concluded a contract with a telecommunications service provider",
        },
        {
          question:
            "True or False: Access rights in privacy law allow individuals to view and modify their personal data.",
          options: ["False", "True"],
          correctAnswer: "True",
        },
        {
          question:
            "In data protection, what does 'access' primarily refer to?",
          options: [
            "Physical access to computer systems",
            "Network connectivity permissions",
            "The ability to view, modify, and challenge the accuracy of personal data",
            "Administrative privileges in databases",
          ],
          correctAnswer:
            "The ability to view, modify, and challenge the accuracy of personal data",
        },
        {
          question:
            "Complete the sentence: The EU Directive 97/66/EC concerns the processing of _____ data in telecommunications.",
          options: ["technical", "administrative", "commercial", "personal"],
          correctAnswer: "personal",
        },
        {
          question:
            "Which principle is fundamental to personal data protection?",
          options: [
            "All data must be stored indefinitely",
            "Companies can use personal data without consent",
            "Data subjects have the right to access their personal information",
            "Personal data can be shared freely between organizations",
          ],
          correctAnswer:
            "Data subjects have the right to access their personal information",
        },
      ],
      "e-commerce": [
        {
          question:
            "What is an 'abbreviation' in the context of electronic messages?",
          options: [
            "A type of email header",
            "A network protocol identifier",
            "A simple text compression technique",
            "A shortened version of a message that can verify integrity or serve as an electronic signature",
          ],
          correctAnswer:
            "A shortened version of a message that can verify integrity or serve as an electronic signature",
        },
        {
          question:
            "True or False: A Certificate Revocation List (CRL) contains certificates that have been revoked before their expiration date.",
          options: ["False", "True"],
          correctAnswer: "True",
        },
        {
          question: "What is the primary purpose of encryption in e-commerce?",
          options: [
            "To compress data for faster transmission",
            "To transform clear messages into coded, unintelligible messages for interceptors",
            "To organize database records",
            "To create user interfaces",
          ],
          correctAnswer:
            "To transform clear messages into coded, unintelligible messages for interceptors",
        },
        {
          question:
            "In digital certificates, what does a 'subscriber' refer to?",
          options: [
            "Someone who pays for internet services",
            "A person named in a certificate who holds a private key corresponding to a public key",
            "A database administrator",
            "A network security officer",
          ],
          correctAnswer:
            "A person named in a certificate who holds a private key corresponding to a public key",
        },
        {
          question:
            "Cryptography in e-commerce ensures three main security aspects. Which is NOT one of them?",
          options: [
            "Message integrity",
            "Data compression",
            "Confidentiality",
            "Authentication",
          ],
          correctAnswer: "Data compression",
        },
      ],
      networks: [
        {
          question:
            "According to telecommunications law, what constitutes 'access' to networks?",
          options: [
            "Physical entry to telecommunications buildings",
            "Permission to use telephone lines",
            "Provision of means, hardware, software, or services to enable electronic communications",
            "Authorization to install network equipment",
          ],
          correctAnswer:
            "Provision of means, hardware, software, or services to enable electronic communications",
        },
        {
          question:
            "True or False: A network subscriber pays a fixed fee for access rights, independent of usage billing.",
          options: ["False", "True"],
          correctAnswer: "True",
        },
        {
          question:
            "What is the primary characteristic of network access in telecommunications?",
          options: [
            "It provides unlimited data storage",
            "It enables the provision of electronic communication services",
            "It guarantees 100% uptime",
            "It includes free technical support",
          ],
          correctAnswer:
            "It enables the provision of electronic communication services",
        },
        {
          question:
            "Complete the definition: Network access involves making available _____ to enable communication services.",
          options: [
            "exclusively wireless connections",
            "only physical infrastructure",
            "means, hardware, software, or services",
            "government-approved equipment only",
          ],
          correctAnswer: "means, hardware, software, or services",
        },
        {
          question:
            "Which French law regulates electronic communications and audiovisual services?",
          options: [
            "Law No. 2004-669 of July 9, 2004",
            "Neither law applies",
            "Both laws work together",
            "Law No. 1986-1067 of September 30, 1986",
          ],
          correctAnswer: "Both laws work together",
        },
      ],
      cybercrime: [
        {
          question:
            "What constitutes 'illegal access' according to the Budapest Convention on Cybercrime?",
          options: [
            "Using someone else's computer with permission",
            "Accessing public websites",
            "Intentional access without right to all or part of a computer system",
            "Reading publicly available information",
          ],
          correctAnswer:
            "Intentional access without right to all or part of a computer system",
        },
        {
          question:
            "True or False: 'Device abuse' includes the production and distribution of tools designed to commit computer crimes.",
          options: ["True", "False"],
          correctAnswer: "True",
        },
        {
          question: "What is cryptanalysis in the context of cybercrime?",
          options: [
            "Creating new encryption algorithms",
            "The art of analyzing encrypted messages to decode them and break the code",
            "Installing security software",
            "Monitoring network traffic",
          ],
          correctAnswer:
            "The art of analyzing encrypted messages to decode them and break the code",
        },
        {
          question:
            "Complete the sentence: Differential cryptanalysis is a technique that analyzes the evolution of _____ applied to two plaintext messages.",
          options: [
            "file sizes",
            "encryption differences",
            "transmission speeds",
            "user permissions",
          ],
          correctAnswer: "encryption differences",
        },
        {
          question:
            "According to cybercrime law, which element is essential for illegal access charges?",
          options: [
            "Physical presence at the crime scene",
            "Use of specialized hacking tools",
            "Financial gain from the access",
            "Intentional action without authorization",
          ],
          correctAnswer: "Intentional action without authorization",
        },
      ],
      miscellaneous: [
        {
          question:
            "What does 'access' mean in the context of information retrieval?",
          options: [
            "Permission to enter a building",
            "The means used to obtain information from a storage medium",
            "Network connection speed",
            "User authentication credentials",
          ],
          correctAnswer:
            "The means used to obtain information from a storage medium",
        },
        {
          question:
            "True or False: Computer crime encompasses all offenses involving the use of computer technologies.",
          options: ["False", "True"],
          correctAnswer: "True",
        },
        {
          question:
            "What characterizes information society crimes according to EU communications?",
          options: [
            "Only crimes committed in physical locations",
            "Exploitation of information networks without geographical constraints",
            "Crimes involving only financial institutions",
            "Offenses limited to government systems",
          ],
          correctAnswer:
            "Exploitation of information networks without geographical constraints",
        },
        {
          question:
            "Complete the definition: Information and communication technologies enable the circulation of data that are _____ and _____.",
          options: [
            "physical and permanent",
            "visible and stable",
            "intangible and volatile",
            "local and restricted",
          ],
          correctAnswer: "intangible and volatile",
        },
        {
          question:
            "What is the primary goal of creating a safer information society?",
          options: [
            "Limiting access to technology",
            "Strengthening information infrastructure security and fighting cybercrime",
            "Reducing internet usage",
            "Eliminating digital communications",
          ],
          correctAnswer:
            "Strengthening information infrastructure security and fighting cybercrime",
        },
      ],
      "it-contract": [
        {
          question: "What is a Service Level Agreement (SLA) in IT contracts?",
          options: [
            "A software installation guide",
            "A contract defining the level of service expected from a service provider",
            "A user manual for applications",
            "A network configuration document",
          ],
          correctAnswer:
            "A contract defining the level of service expected from a service provider",
        },
        {
          question:
            "True or False: Software licensing agreements define the legal permissions for using software.",
          options: ["True", "False"],
          correctAnswer: "True",
        },
        {
          question: "What does SaaS stand for in IT contracts?",
          options: [
            "Security as a Standard",
            "Software as a Service",
            "System as a Solution",
            "Storage as a Service",
          ],
          correctAnswer: "Software as a Service",
        },
        {
          question:
            "Complete the sentence: An End User License Agreement (EULA) is a contract between the software _____ and the _____.",
          options: [
            "developer and distributor",
            "vendor and retailer",
            "publisher and user",
            "manufacturer and installer",
          ],
          correctAnswer: "publisher and user",
        },
        {
          question:
            "Which element is typically NOT included in IT service contracts?",
          options: [
            "Performance metrics",
            "Personal medical information",
            "Support procedures",
            "Liability limitations",
          ],
          correctAnswer: "Personal medical information",
        },
      ],
      "intellectual-property": [
        {
          question: "What does 'computer-generated' mean in copyright law?",
          options: [
            "Any work created using a computer",
            "Software code written by programmers",
            "A work created by computer without human intervention",
            "Digital art created by humans using computers",
          ],
          correctAnswer:
            "A work created by computer without human intervention",
        },
        {
          question:
            "True or False: Cryptography techniques can be considered intellectual property.",
          options: ["False", "True"],
          correctAnswer: "True",
        },
        {
          question:
            "According to New Zealand's Copyright Act 1994, what defines computer-generated works?",
          options: [
            "Any digital file created on a computer",
            "Works created by computer in circumstances where there is no human author",
            "Software applications developed by teams",
            "Websites designed using computer tools",
          ],
          correctAnswer:
            "Works created by computer in circumstances where there is no human author",
        },
        {
          question:
            "Complete the sentence: Intellectual property in IT contexts often involves protection of _____ and _____.",
          options: [
            "hardware and cables",
            "algorithms and software",
            "buildings and equipment",
            "employees and contractors",
          ],
          correctAnswer: "algorithms and software",
        },
        {
          question:
            "Which is a key consideration for computer-generated intellectual property?",
          options: [
            "Ensuring the computer is properly licensed",
            "Determining authorship when no human directly creates the work",
            "Verifying the computer's processing speed",
            "Confirming the computer's physical location",
          ],
          correctAnswer:
            "Determining authorship when no human directly creates the work",
        },
      ],
      organizations: [
        {
          question: "What does ISO stand for in international standards?",
          options: [
            "International Standards Office",
            "International Organization for Standardization",
            "Internet Security Organization",
            "Information Systems Oversight",
          ],
          correctAnswer: "International Organization for Standardization",
        },
        {
          question:
            "True or False: The IEEE is primarily concerned with electrical and electronics engineering standards.",
          options: ["False", "True"],
          correctAnswer: "True",
        },
        {
          question:
            "What is the primary role of the W3C (World Wide Web Consortium)?",
          options: [
            "Providing internet access",
            "Developing web standards and protocols",
            "Manufacturing computer hardware",
            "Regulating telecommunications",
          ],
          correctAnswer: "Developing web standards and protocols",
        },
        {
          question:
            "Complete the sentence: The IETF (Internet Engineering Task Force) is responsible for developing _____ standards.",
          options: [
            "computer hardware",
            "software licensing",
            "internet protocol",
            "data storage",
          ],
          correctAnswer: "internet protocol",
        },
        {
          question:
            "Which organization would most likely develop standards for information security management?",
          options: [
            "Local government agencies",
            "ISO (International Organization for Standardization)",
            "Individual software companies",
            "University research departments",
          ],
          correctAnswer: "ISO (International Organization for Standardization)",
        },
      ],
    };
    let categoryQuestions =
      questionBank[category] || questionBank["miscellaneous"];
    categoryQuestions = categoryQuestions.map((question) => {
      const correctAnswer = question.correctAnswer;
      const shuffledOptions = shuffleArray(question.options);

      return {
        question: question.question,
        options: shuffledOptions,
        correctAnswer: correctAnswer,
      };
    });
    const shuffled = shuffleArray(categoryQuestions);
    return shuffled.slice(0, 5);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    const fallbackQuestions = [
      {
        question: "What does ICT stand for?",
        options: [
          "Internet and Computer Technology",
          "Information and Communication Technology",
          "Information and Computer Technology",
          "Internet and Communication Technology",
        ],
        correctAnswer: "Information and Communication Technology",
      },
      {
        question: "Which of the following is a programming language?",
        options: ["HTML", "JavaScript", "CSS", "HTTP"],
        correctAnswer: "JavaScript",
      },
      {
        question: "What does URL stand for?",
        options: [
          "Universal Resource Link",
          "Uniform Resource Locator",
          "Unified Resource Locator",
          "Universal Resource Locator",
        ],
        correctAnswer: "Uniform Resource Locator",
      },
      {
        question: "What is the main purpose of a firewall?",
        options: [
          "Data storage",
          "Network security",
          "File compression",
          "Image editing",
        ],
        correctAnswer: "Network security",
      },
      {
        question: "Which protocol is used for secure web browsing?",
        options: ["HTTP", "FTP", "HTTPS", "SMTP"],
        correctAnswer: "HTTPS",
      },
    ];
    return fallbackQuestions.map((question) => {
      const correctAnswer = question.correctAnswer;
      const shuffledOptions = shuffleArray(question.options);

      return {
        question: question.question,
        options: shuffledOptions,
        correctAnswer: correctAnswer,
      };
    });
  }
};
