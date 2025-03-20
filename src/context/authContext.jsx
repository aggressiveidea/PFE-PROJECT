import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to log in user
  const login = async (email, password) => {
    try {
      const res = await fetch("http://your-api.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user); // Store user info in state
      }

      return data;
    } catch (error) {
      console.error("Login failed", error);
      return { success: false, message: "Login failed" };
    }
  };

  // Function to fetch profile data
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://your-api.com/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const profileData = await res.json();
    setUser(profileData);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};
