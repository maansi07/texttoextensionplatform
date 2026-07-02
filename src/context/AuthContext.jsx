import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("/api/auth/me", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("Error loading user profile:", err);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to sign in");
    }

    localStorage.setItem("token", data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      plan: data.plan,
      avatar: data.avatar
    });
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create account");
    }

    localStorage.setItem("token", data.token);
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      plan: data.plan
    });
    return data;
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error("Error logging out from server:", err);
      }
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  const updatePlan = async (newPlan) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No active session found");
    const res = await fetch("/api/auth/upgrade", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ plan: newPlan })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to upgrade plan");
    }
    setUser((prev) => (prev ? { ...prev, plan: data.plan } : null));
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}