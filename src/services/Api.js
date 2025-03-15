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

        return await response.json();
    } catch (error) {
        console.log("error login:", error);
        throw error;
    }
};
export const getProfile = async (token) => {
  try {
      const response = await fetch("http://localhost:5000/auth/profile", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`  
          },
      });

      if (!response.ok) {
          throw new Error("Failed to fetch profile");
      }

      return await response.json();
  } catch (error) {
      console.error("🚨 Error fetching profile:", error);
      throw error;
  }
};


