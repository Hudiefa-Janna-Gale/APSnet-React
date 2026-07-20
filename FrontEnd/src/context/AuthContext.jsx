import { createContext, useContext, useReducer } from "react";
import api from "../api";

// ==============================================================
// AUTH CONTEXT + REDUCER  (Global State Management)
// --------------------------------------------------------------
// - Context  : wuxuu xogta (user, token) gaarsiiyaa component KASTA
//              iyada oo aan props la isu dhiibayn (prop drilling).
// - Reducer  : hal meel ayaa lagu beddelaa state-ka (LOGIN / LOGOUT),
//              taas oo ka fudud in la raaco marka project-ku weynaado.
// ==============================================================

const AuthContext = createContext(null);

// 1. INITIAL STATE: ka soo akhri localStorage si login-ku
//    u sii jiro marka browser-ka dib loo furo (refresh).
const initialState = {
  user: JSON.parse(localStorage.getItem("shopUser")) || null,
  token: localStorage.getItem("shopToken") || null,
};

// 2. REDUCER: wuxuu qaataa (state, action) -> wuxuuna celiyaa state cusub.
//    Action kasta wuxuu leeyahay "type" (magaca falka) iyo "payload" (xogta).
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

// 3. PROVIDER: wuxuu duudduubaa App-ka oo dhan (fiiri App.jsx)
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // LOGIN: u dir email + password API-ga, keydi token-ka + user-ka
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("shopToken", res.data.token);
    localStorage.setItem("shopUser", JSON.stringify(res.data.user));
    dispatch({ type: "LOGIN", payload: res.data });
    return res.data;
  };

  // REGISTER: samee account cusub (Role = Customer had iyo jeer)
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

  // LOGOUT: tirtir token-ka + user-ka
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

// 4. CUSTOM HOOK: component kasta wuxuu ku isticmaalaa `useAuth()`
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
