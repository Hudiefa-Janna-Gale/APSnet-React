import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ==============================================================
// ROUTE PROTECTION (Authorization dhinaca React-ka)
// --------------------------------------------------------------
// - ProtectedRoute : waa in uu user SOO GALAY (logged in) yahay.
// - AdminRoute     : waa in uu user-ku yahay ADMIN.
// Haddii kale <Navigate> ayaa bogga kale u wareejinaya.
//
// XUSUUSNOW: tani waa UX kaliya — amniga dhabta ah wuxuu ku jiraa
// backend-ka ([Authorize] + JWT). Xitaa haddii qof ka gudbo React,
// API-gu waa diidayaa.
// ==============================================================

// User aan soo gelin -> u dir /login
export function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// User aan Admin ahayn -> u dir bogga hore /
export function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
