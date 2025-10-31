import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CartProvider } from "./context/ProductContext.tsx";
import { AuthProvider } from "./context/auth/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);
