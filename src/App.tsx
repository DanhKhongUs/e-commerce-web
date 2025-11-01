import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import Profile from "./pages/member/Profile";
import TransactionHistory from "./pages/member/TransactionHistory";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import Cart from "./pages/product/Cart";
import Checkout from "./pages/product/CheckOut";
import MemberLayout from "./components/layout/MemberLayout";
import AdminLayout from "./components/layout/AdminLayout";
import DashBoard from "./pages/admin/DashBoard";
import Transactions from "./pages/admin/Transactions";
import Home from "./pages/home/Home";
import AddProduct from "./pages/admin/AddProduct";

function AppContent() {
  const location = useLocation();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  const hideFooterRegex = /^\/($|products\/\d+|cart|checkout|blogs)$/; // match /products/123, / (home)
  const shouldShowFooter =
    !hideFooterRegex.test(location.pathname) && !isAdminPage && !isAuthPage;

  return (
    <>
      {!isAdminPage && !isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<MemberLayout />}>
          <Route index element={<Profile />} />
          <Route path="transactionHistory" element={<TransactionHistory />} />
        </Route>
        {/* <Route element={<ProtectedRoute requiredRole="admin" />}> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="products" element={<AddProduct />} />
        </Route>
        {/* </Route> */}
      </Routes>

      {shouldShowFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
