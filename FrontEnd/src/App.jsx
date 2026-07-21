import Approter from "./routes/Approter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Approter />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
