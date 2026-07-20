import Approter from "./routes/Approter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// App-ku hadda waa mid aad u yar:
// - AuthProvider : user + token (Context + Reducer)
// - CartProvider : cart-ka (Context + Reducer)
// State-kii oo dhan wuxuu u guuray context-yada (global state management),
// marka props badan looma baahna.
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
