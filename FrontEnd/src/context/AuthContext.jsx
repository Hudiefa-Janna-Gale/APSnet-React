import { createContext, useContext, useReducer } from "react";
import api from "../api";

const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem("shopUser")) || null,
  token: localStorage.getItem("shopToken") || null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return { user: null, token: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("shopToken", res.data.token);
    localStorage.setItem("shopUser", JSON.stringify(res.data.user));
    dispatch({ type: "LOGIN", payload: res.data });
    return res.data;
  };

  const register = async (fullName, email, password) => {
    const res = await api.post("/auth/register", {
      fullName,
      email,
      passwordHash: password,
    });
    localStorage.setItem("shopToken", res.data.token);
    localStorage.setItem("shopUser", JSON.stringify(res.data.user));
    dispatch({ type: "LOGIN", payload: res.data });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("shopToken");
    localStorage.removeItem("shopUser");
    dispatch({ type: "LOGOUT" });
  };

  const isAdmin = state.user?.role === "Admin";

  return (
    <AuthContext.Provider
      value={{ user: state.user, token: state.token, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
