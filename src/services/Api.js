export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:9999/api/v1";

console.log("API_BASE_URL:", API_BASE_URL);

const getAuthToken = () => {
  const authData = localStorage.getItem("authData");
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      return parsed.token;
    } catch (e) {
      return null;
    }
  }
  return null;
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

const determineRoleFromEmail = (email) => {
  if (email === "imessaoudenealdjia@gmail.com") {
    return "admin";
  }
  if (email.includes("admin")) {
    return "admin";
  }
  return "teacher";
};

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Login failed" }));
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    if (data.data && data.data.user) {
      if (!data.data.user.role) {
        data.data.user.role = determineRoleFromEmail(data.data.user.email);
      }
    }
    if (
      data.success &&
      data.data &&
      data.data.user &&
      data.data.user.role === "Administrator"
    ) {
      data.data.user.role = "admin";
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getTeacherScheduleForSemester(semester) {
  try {
    const authData = localStorage.getItem("authData");
    if (!authData) {
      throw new Error("No authentication data found");
    }

    const parsed = JSON.parse(authData);
    if (!parsed.token) {
      throw new Error("No authentication token found");
    }

    const scheduleUrl = `${API_BASE_URL}/teacher/me/schedule/${semester}`;

    const response = await fetch(scheduleUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parsed.token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: true, data: { scheduledClasses: [] } };
      }
      throw new Error(`Failed to fetch schedule: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching teacher schedule:", error);
    throw error;
  }
}

export async function getTeacherTodaySchedule() {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;

    const currentSemester =
      currentMonth >= 9 || currentMonth <= 1 ? "First" : "Second";

    const scheduleResponse = await getTeacherScheduleForSemester(
      currentSemester
    );

    if (!scheduleResponse.success || !scheduleResponse.data) {
      return { success: true, data: [] };
    }

    const allClasses = scheduleResponse.data.scheduledClasses || [];

    const today = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayName = dayNames[today.getDay()];
    const todayClasses = allClasses.filter(
      (classItem) =>
        classItem.day && classItem.day.toLowerCase() === todayName.toLowerCase()
    );

    const transformedClasses = todayClasses.map((classItem) => ({
      time: getTimeDisplayFromSlot(classItem.slot),
      section: classItem.section
        ? `${classItem.section.speciality?.name || ""} ${
            classItem.section.code || ""
          }`.trim()
        : "N/A",
      course: classItem.course?.name || "Unknown Course",
      classroom:
        classItem.classroom?.name || (classItem.isOnline ? "Online" : "TBA"),
      building: classItem.classroom?.building || "",
      slot: classItem.slot,
      classType: classItem.type || "Lecture",
      groupName: classItem.group?.name || null,
      isOnline: classItem.isOnline || false,
    }));

    return {
      success: true,
      data: transformedClasses,
      semester: currentSemester,
      totalClasses: allClasses.length,
    };
  } catch (error) {
    console.error("Error fetching today's schedule:", error);
    throw error;
  }
}

export async function getTeacherNextClass() {
  try {
    const todayScheduleResponse = await getTeacherTodaySchedule();

    if (!todayScheduleResponse.success || !todayScheduleResponse.data.length) {
      return { success: true, data: null };
    }

    const todayClasses = todayScheduleResponse.data;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let nextClass = null;
    let minTimeDiff = Number.POSITIVE_INFINITY;

    todayClasses.forEach((classItem) => {
      const startTime = parseTimeToMinutes(classItem.time.split(" - ")[0]);
      const timeDiff = startTime - currentTime;

      if (timeDiff > 0 && timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        nextClass = classItem;
      }
    });

    return {
      success: true,
      data: nextClass,
    };
  } catch (error) {
    console.error("Error fetching next class:", error);
    throw error;
  }
}

export async function getTeacherWeeklyStats() {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentSemester =
      currentMonth >= 9 || currentMonth <= 1 ? "First" : "Second";

    const scheduleResponse = await getTeacherScheduleForSemester(
      currentSemester
    );

    if (!scheduleResponse.success || !scheduleResponse.data) {
      return {
        success: true,
        data: {
          todayClasses: 0,
          weeklyClasses: 0,
          totalClasses: 0,
        },
      };
    }

    const allClasses = scheduleResponse.data.scheduledClasses || [];

    const today = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayName = dayNames[today.getDay()];
    const todayClasses = allClasses.filter(
      (classItem) =>
        classItem.day && classItem.day.toLowerCase() === todayName.toLowerCase()
    ).length;

    const weeklyClasses = allClasses.length;

    return {
      success: true,
      data: {
        todayClasses,
        weeklyClasses,
        totalClasses: allClasses.length,
      },
    };
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    throw error;
  }
}
function getTimeDisplayFromSlot(slot) {
  const timeSlots = {
    Slot1: "08:00 - 09:30",
    Slot2: "09:40 - 11:10",
    Slot3: "11:20 - 12:50",
    Slot4: "13:00 - 14:30",
    Slot5: "14:40 - 16:10",
    Slot6: "16:20 - 17:50",
  };
  return timeSlots[slot] || "00:00 - 00:00";
}

function parseTimeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

export async function getAllTeachers() {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `failed to fetch teachers , status: ${response.status}`,
      }));
      throw new Error(errorData.message || "failed to fetch teachers");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createTeacher(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create teacher" }));
      throw new Error(errorData.message || "Failed to create teacher");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateTeacher(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to update teacher" }));
      throw new Error(errorData.message || "Failed to update teacher");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteTeacher(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Failed to delete teacher. Status: ${response.status}`,
      }));
      throw new Error(errorData.message || "Failed to delete teacher");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getAllSections() {
  try {
    const response = await fetch(`${API_BASE_URL}/section`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `failed to fetch sections. Status: ${response.status}`,
      }));
      throw new Error(errorData.message || "failed to fetch sections");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAllClassrooms() {
  try {
    const response = await fetch(`${API_BASE_URL}/classroom`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `failed to fetch classrooms. Status: ${response.status}`,
      }));
      throw new Error(errorData.message || "failed to fetch classrooms");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAllCourses() {
  try {
    const response = await fetch(`${API_BASE_URL}/course`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Failed to fetch courses. Status: ${response.status}`,
      }));
      throw new Error(errorData.message || "Failed to fetch courses");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getMyProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    if (data.success && data.data && data.data.user && !data.data.user.role) {
      data.data.user.role = determineRoleFromEmail(data.data.user.email);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user by ID");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCompleteUserProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch complete profile");
    }

    const data = await response.json();

    if (data.success && data.data && data.data.user) {
      if (!data.data.user.role) {
        data.data.user.role = determineRoleFromEmail(data.data.user.email);
      }

      if (data.data.user.role === "Administrator") {
        data.data.user.role = "admin";
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfile(userId, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Failed to update user profile. Status: ${response.status}`,
      }));
      throw errorData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function createClassroom(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/classroom`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `failed to create classroom. Status: ${response.status}`,
      }));
      throw errorData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function getClassrooms() {
  try {
    const response = await fetch(`${API_BASE_URL}/classroom`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("failed to fetch classrooms");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateClassroom(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/classroom/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `failed to update classroom. Status: ${response.status}`,
      }));
      throw errorData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function deleteClassroom(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/classroom/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `failed to delete classroom. Status: ${response.status}`,
      }));
      throw errorData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function getSectionSchedule(sectionId, semester) {
  try {
    const url = `${API_BASE_URL}/section/${sectionId}/schedule/${semester}`;
    const headers = getAuthHeaders();

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      let errorMessage = "failed to fetch section schedule";

      if (responseData) {
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (
          responseData.errors &&
          Array.isArray(responseData.errors) &&
          responseData.errors.length > 0
        ) {
          errorMessage =
            responseData.errors[0].message || responseData.errors[0];
        } else if (typeof responseData === "string") {
          errorMessage = responseData;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.responseData = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    const enhancedError = new Error(
      `section schedule fetch failed: ${error.message}`
    );
    enhancedError.originalError = error;
    enhancedError.sectionId = sectionId;
    enhancedError.semester = semester;

    throw enhancedError;
  }
}

export async function getSectionScheduleStatistics(sectionId, semester) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/section/${sectionId}/schedule/${semester}/other/statistics`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
<<<<<<< Updated upstream
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
=======
      throw new Error("failed to fetch section schedule statistics");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createSectionSchedule(sectionId, semester, scheduleData) {
  const requiredFields = [
    "day",
    "slot",
    "courseId",
    "teacherId",
    "classroomId",
    "classType",
  ];
  const missingFields = requiredFields.filter((field) => !scheduleData[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  try {
    const url = `${API_BASE_URL}/section/${sectionId}/schedule/${semester}`;
    const headers = getAuthHeaders();
    const requestBody = JSON.stringify(scheduleData);

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: requestBody,
    });

    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      let errorMessage = "Failed to create schedule";

      if (responseData) {
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (
          responseData.errors &&
          Array.isArray(responseData.errors) &&
          responseData.errors.length > 0
        ) {
          errorMessage =
            responseData.errors[0].message || responseData.errors[0];
        } else if (typeof responseData === "string") {
          errorMessage = responseData;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.responseData = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    const enhancedError = new Error(
      `Schedule creation failed: ${error.message}`
    );
    enhancedError.originalError = error;
    enhancedError.sectionId = sectionId;
    enhancedError.semester = semester;
    enhancedError.scheduleData = scheduleData;

    throw enhancedError;
  }
}

export async function updateSectionSchedule(
  sectionId,
  semester,
  scheduleId,
  scheduleData
) {
  try {
    const url = `${API_BASE_URL}/section/${sectionId}/schedule/${semester}/${scheduleId}`;
    const headers = getAuthHeaders();

    const updateData = {
      day: scheduleData.day,
      slot: scheduleData.slot,
      courseId: scheduleData.courseId,
      teacherId: scheduleData.teacherId,
      classroomId: scheduleData.classroomId,
      classType: scheduleData.classType,
      groupsId: scheduleData.groupsId,
      isOnline: scheduleData.isOnline,
    };

    Object.keys(updateData).forEach((key) => {
      if (
        updateData[key] === null ||
        updateData[key] === undefined ||
        updateData[key] === ""
      ) {
        delete updateData[key];
      }
    });

    const requestBody = JSON.stringify(updateData);
    console.log("API: Update request data:", updateData);

    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: requestBody,
    });

    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      let errorMessage = "Failed to update schedule";

      if (responseData) {
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (
          responseData.errors &&
          Array.isArray(responseData.errors) &&
          responseData.errors.length > 0
        ) {
          errorMessage =
            responseData.errors[0].message || responseData.errors[0];
        } else if (typeof responseData === "string") {
          errorMessage = responseData;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.responseData = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    const enhancedError = new Error(`Schedule update failed: ${error.message}`);
    enhancedError.originalError = error;
    enhancedError.sectionId = sectionId;
    enhancedError.semester = semester;
    enhancedError.scheduleId = scheduleId;
    enhancedError.scheduleData = scheduleData;

    throw enhancedError;
  }
}

export async function deleteSectionSchedule(sectionId, semester, scheduleId) {
  try {
    const url = `${API_BASE_URL}/section/${sectionId}/schedule/${semester}/${scheduleId}`;
    const headers = getAuthHeaders();

    const response = await fetch(url, {
      method: "DELETE",
      headers: headers,
    });

    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      let errorMessage = "Failed to delete schedule";

      if (responseData) {
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (
          responseData.errors &&
          Array.isArray(responseData.errors) &&
          responseData.errors.length > 0
        ) {
          errorMessage =
            responseData.errors[0].message || responseData.errors[0];
        } else if (typeof responseData === "string") {
          errorMessage = responseData;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.responseData = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    const enhancedError = new Error(
      `Schedule deletion failed: ${error.message}`
    );
    enhancedError.originalError = error;
    enhancedError.sectionId = sectionId;
    enhancedError.semester = semester;
    enhancedError.scheduleId = scheduleId;

    throw enhancedError;
  }
}

export async function generateSectionSchedule(
  sectionId,
  semester,
  assignmentsData
) {
  try {
    console.log(
      "Generating schedule for section:",
      sectionId,
      "semester:",
      semester
    );
    console.log("Assignments data:", assignmentsData);

    if (!sectionId) {
      throw new Error("Section ID is required");
    }
    if (!semester) {
      throw new Error("Semester is required");
    }
    if (
      !assignmentsData ||
      !assignmentsData.assignments ||
      !Array.isArray(assignmentsData.assignments)
    ) {
      throw new Error("Valid assignments data is required");
    }
    if (assignmentsData.assignments.length === 0) {
      throw new Error("At least one assignment is required");
    }

    // Validate each assignment
    assignmentsData.assignments.forEach((assignment, index) => {
      if (!assignment.courseId) {
        throw new Error(`Assignment ${index + 1}: Course ID is required`);
      }
      if (!assignment.teacherId) {
        throw new Error(`Assignment ${index + 1}: Teacher ID is required`);
      }
      if (!assignment.classType) {
        throw new Error(`Assignment ${index + 1}: Class type is required`);
      }
      // groupId can be null for lectures, but should be present for TP/TD
      if (
        (assignment.classType === "DirectedWork" ||
          assignment.classType === "PracticalWork") &&
        !assignment.groupId
      ) {
        throw new Error(
          `Assignment ${index + 1}: Group ID is required for ${
            assignment.classType
          }`
        );
      }
      if (assignment.classType === "Lecture" && assignment.groupId) {
        throw new Error(
          `Assignment ${
            index + 1
          }: Group ID should not be specified for lectures`
        );
      }
    });

    const url = `${API_BASE_URL}/section/${sectionId}/schedule/${semester}/other/generate`;
    const headers = getAuthHeaders();
    const requestBody = JSON.stringify(assignmentsData);

    console.log("Making API request to:", url);
    console.log("Request body:", requestBody);

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: requestBody,
    });

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      let errorMessage = "Failed to generate schedule";

      if (responseData) {
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (
          responseData.errors &&
          Array.isArray(responseData.errors) &&
          responseData.errors.length > 0
        ) {
          errorMessage =
            responseData.errors[0].message || responseData.errors[0];
        } else if (typeof responseData === "string") {
          errorMessage = responseData;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.responseData = responseData;
      throw error;
    }

    console.log("Schedule generation successful:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in generateSectionSchedule:", error);
    const enhancedError = new Error(
      `Schedule generation failed: ${error.message}`
    );
    enhancedError.originalError = error;
    enhancedError.sectionId = sectionId;
    enhancedError.semester = semester;
    enhancedError.assignmentsData = assignmentsData;

    throw enhancedError;
  }
}

export async function generateSectionTimetablePdf(sectionId, semester) {
  try {
    console.log(
      `Generating PDF for section ${sectionId}, semester ${semester}`
    );
    const response = await fetch(
      `${API_BASE_URL}/section/${sectionId}/schedule/${semester}/other/generate-pdf`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PDF generation failed:", response.status, errorText);
      throw new Error(
        `Failed to generate PDF: ${response.status} ${errorText}`
      );
    }

    const contentType = response.headers.get("content-type");
    console.log("Response content type:", contentType);

    if (contentType && contentType.includes("application/pdf")) {
      console.log("Received PDF file directly");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      return {
        success: true,
        data: {
          pdfUrl: url,
          blob: blob,
        },
      };
    } else if (contentType && contentType.includes("application/json")) {
      console.log("Received JSON response");
      const data = await response.json();
      console.log("PDF generation response:", data);
      return data;
>>>>>>> Stashed changes
    } else {
      try {
        const data = await response.json();
        console.log("PDF generation response (JSON):", data);
        return data;
      } catch (jsonError) {
        console.log("Failed to parse as JSON, treating as PDF blob");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        return {
          success: true,
          data: {
            pdfUrl: url,
            blob: blob,
          },
        };
      }
    }
  } catch (error) {
    console.error("Error in generateSectionTimetablePdf:", error);
    throw error;
  }
}

export async function getSpecialities() {
  try {
    const response = await fetch(`${API_BASE_URL}/speciality`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch specialities");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function createSection(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/section`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Failed to create section. Status: ${response.status}`,
      }));
      throw errorData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function updateSection(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/section/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Failed to update section. Status: ${response.status}`,
      }));
      throw errorData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function deleteSection(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/section/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Failed to delete section. Status: ${response.status}`,
      }));
      throw errorData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

<<<<<<< Updated upstream
  const result = await response.json();
  return result.data;
};

export const loginUserOrg = async (email, password) => {
=======
export async function createTeacherComplaint(data) {
>>>>>>> Stashed changes
  try {
    const response = await fetch(`${API_BASE_URL}/teacher-complaint`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Failed to create teacher complaint. Status: ${response.status}`,
      }));
      const errorMessage =
        errorData.errors && errorData.errors[0] && errorData.errors[0].message
          ? errorData.errors[0].message
          : errorData.message || "Unknown error";

      const error = new Error(errorMessage);
      error.originalError = errorData;
      throw error;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function getTeacherComplaints(teacherId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/teacher-complaint/teacher/${teacherId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch teacher complaints");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
<<<<<<< Updated upstream
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
  }

  return (
    categoryMap[categoryId] || {
      name: "Unknown Category",
      color: "#6b7280",
      description: "Category description not available",
    }
  )
}

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

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
          question: "In data protection, what does 'access' primarily refer to?",
          options: [
            "Physical access to computer systems",
            "Network connectivity permissions",
            "The ability to view, modify, and challenge the accuracy of personal data",
            "Administrative privileges in databases",
          ],
          correctAnswer: "The ability to view, modify, and challenge the accuracy of personal data",
        },
        {
          question:
            "Complete the sentence: The EU Directive 97/66/EC concerns the processing of _____ data in telecommunications.",
          options: ["technical", "administrative", "commercial", "personal"],
          correctAnswer: "personal",
        },
        {
          question: "Which principle is fundamental to personal data protection?",
          options: [
            "All data must be stored indefinitely",
            "Companies can use personal data without consent",
            "Data subjects have the right to access their personal information",
            "Personal data can be shared freely between organizations",
          ],
          correctAnswer: "Data subjects have the right to access their personal information",
        },
      ],
      "e-commerce": [
        {
          question: "What is an 'abbreviation' in the context of electronic messages?",
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
          correctAnswer: "To transform clear messages into coded, unintelligible messages for interceptors",
        },
        {
          question: "In digital certificates, what does a 'subscriber' refer to?",
          options: [
            "Someone who pays for internet services",
            "A person named in a certificate who holds a private key corresponding to a public key",
            "A database administrator",
            "A network security officer",
          ],
          correctAnswer: "A person named in a certificate who holds a private key corresponding to a public key",
        },
        {
          question: "Cryptography in e-commerce ensures three main security aspects. Which is NOT one of them?",
          options: ["Message integrity", "Data compression", "Confidentiality", "Authentication"],
          correctAnswer: "Data compression",
        },
      ],
      networks: [
        {
          question: "According to telecommunications law, what constitutes 'access' to networks?",
          options: [
            "Physical entry to telecommunications buildings",
            "Permission to use telephone lines",
            "Provision of means, hardware, software, or services to enable electronic communications",
            "Authorization to install network equipment",
          ],
          correctAnswer: "Provision of means, hardware, software, or services to enable electronic communications",
        },
        {
          question:
            "True or False: A network subscriber pays a fixed fee for access rights, independent of usage billing.",
          options: ["False", "True"],
          correctAnswer: "True",
        },
        {
          question: "What is the primary characteristic of network access in telecommunications?",
          options: [
            "It provides unlimited data storage",
            "It enables the provision of electronic communication services",
            "It guarantees 100% uptime",
            "It includes free technical support",
          ],
          correctAnswer: "It enables the provision of electronic communication services",
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
          question: "Which French law regulates electronic communications and audiovisual services?",
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
          question: "What constitutes 'illegal access' according to the Budapest Convention on Cybercrime?",
          options: [
            "Using someone else's computer with permission",
            "Accessing public websites",
            "Intentional access without right to all or part of a computer system",
            "Reading publicly available information",
          ],
          correctAnswer: "Intentional access without right to all or part of a computer system",
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
          correctAnswer: "The art of analyzing encrypted messages to decode them and break the code",
        },
        {
          question:
            "Complete the sentence: Differential cryptanalysis is a technique that analyzes the evolution of _____ applied to two plaintext messages.",
          options: ["file sizes", "encryption differences", "transmission speeds", "user permissions"],
          correctAnswer: "encryption differences",
        },
        {
          question: "According to cybercrime law, which element is essential for illegal access charges?",
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
          question: "What does 'access' mean in the context of information retrieval?",
          options: [
            "Permission to enter a building",
            "The means used to obtain information from a storage medium",
            "Network connection speed",
            "User authentication credentials",
          ],
          correctAnswer: "The means used to obtain information from a storage medium",
        },
        {
          question:
            "True or False: Computer crime encompasses all offenses involving the use of computer technologies.",
          options: ["False", "True"],
          correctAnswer: "True",
        },
        {
          question: "What characterizes information society crimes according to EU communications?",
          options: [
            "Only crimes committed in physical locations",
            "Exploitation of information networks without geographical constraints",
            "Crimes involving only financial institutions",
            "Offenses limited to government systems",
          ],
          correctAnswer: "Exploitation of information networks without geographical constraints",
        },
        {
          question:
            "Complete the definition: Information and communication technologies enable the circulation of data that are _____ and _____.",
          options: ["physical and permanent", "visible and stable", "intangible and volatile", "local and restricted"],
          correctAnswer: "intangible and volatile",
        },
        {
          question: "What is the primary goal of creating a safer information society?",
          options: [
            "Limiting access to technology",
            "Strengthening information infrastructure security and fighting cybercrime",
            "Reducing internet usage",
            "Eliminating digital communications",
          ],
          correctAnswer: "Strengthening information infrastructure security and fighting cybercrime",
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
          correctAnswer: "A contract defining the level of service expected from a service provider",
        },
        {
          question: "True or False: Software licensing agreements define the legal permissions for using software.",
          options: ["True", "False"],
          correctAnswer: "True",
        },
        {
          question: "What does SaaS stand for in IT contracts?",
          options: ["Security as a Standard", "Software as a Service", "System as a Solution", "Storage as a Service"],
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
          question: "Which element is typically NOT included in IT service contracts?",
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
          correctAnswer: "A work created by computer without human intervention",
        },
        {
          question: "True or False: Cryptography techniques can be considered intellectual property.",
          options: ["False", "True"],
          correctAnswer: "True",
        },
        {
          question: "According to New Zealand's Copyright Act 1994, what defines computer-generated works?",
          options: [
            "Any digital file created on a computer",
            "Works created by computer in circumstances where there is no human author",
            "Software applications developed by teams",
            "Websites designed using computer tools",
          ],
          correctAnswer: "Works created by computer in circumstances where there is no human author",
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
          question: "Which is a key consideration for computer-generated intellectual property?",
          options: [
            "Ensuring the computer is properly licensed",
            "Determining authorship when no human directly creates the work",
            "Verifying the computer's processing speed",
            "Confirming the computer's physical location",
          ],
          correctAnswer: "Determining authorship when no human directly creates the work",
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
          question: "What is the primary role of the W3C (World Wide Web Consortium)?",
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
          options: ["computer hardware", "software licensing", "internet protocol", "data storage"],
          correctAnswer: "internet protocol",
        },
        {
          question: "Which organization would most likely develop standards for information security management?",
          options: [
            "Local government agencies",
            "ISO (International Organization for Standardization)",
            "Individual software companies",
            "University research departments",
          ],
          correctAnswer: "ISO (International Organization for Standardization)",
        },
      ],
    }
    let categoryQuestions = questionBank[category] || questionBank["miscellaneous"]
    categoryQuestions = categoryQuestions.map((question) => {
      const correctAnswer = question.correctAnswer
      const shuffledOptions = shuffleArray(question.options)

      return {
        question: question.question,
        options: shuffledOptions,
        correctAnswer: correctAnswer,
      }
    })
    const shuffled = shuffleArray(categoryQuestions)
    return shuffled.slice(0, 5)
  } catch (error) {
    console.error("Error fetching quiz questions:", error)
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
        options: ["Data storage", "Network security", "File compression", "Image editing"],
        correctAnswer: "Network security",
      },
      {
        question: "Which protocol is used for secure web browsing?",
        options: ["HTTP", "FTP", "HTTPS", "SMTP"],
        correctAnswer: "HTTPS",
      },
    ]
    return fallbackQuestions.map((question) => {
      const correctAnswer = question.correctAnswer
      const shuffledOptions = shuffleArray(question.options)

      return {
        question: question.question,
        options: shuffledOptions,
        correctAnswer: correctAnswer,
      }
    })
=======
}

export async function getAllTeacherComplaints() {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher-complaint`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all teacher complaints");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getTeacherComplaintById(complaintId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/teacher-complaint/${complaintId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch teacher complaint");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateTeacherComplaint(complaintId, data) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/teacher-complaint/${complaintId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Failed to update teacher complaint. Status: ${response.status}`,
      }));
      throw errorData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function deleteTeacherComplaint(complaintId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/teacher-complaint/${complaintId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Failed to delete teacher complaint. Status: ${response.status}`,
      }));
      throw errorData;
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
}

export async function getTeacherByUserId(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/user/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch teacher by user ID");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAllAuditLogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/auditlog`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch audit logs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditLogById(auditlogId) {
  try {
    const response = await fetch(`${API_BASE_URL}/auditlog/${auditlogId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch audit log");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
>>>>>>> Stashed changes
  }
}
