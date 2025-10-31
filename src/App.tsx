import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import Address from "./pages/member/Address";
import Profile from "./pages/member/Profile";
import TransactionHistory from "./pages/member/TransactionHistory";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import Cart from "./pages/product/Cart";
import Checkout from "./pages/product/CheckOut";
import ProductPage from "./pages/product/ProductPage";
import BlogsPage from "./pages/blog/BlogsPage";
import SellVehiclePage from "./pages/member/SellVehiclePage";
import BlogDetailPage from "./pages/blog/BlogDetailPage";
import MemberLayout from "./components/layout/MemberLayout";
import AdminLayout from "./components/layout/AdminLayout";
import DashBoard from "./pages/admin/DashBoard";
import Users from "./pages/admin/Users";
import Transactions from "./pages/admin/Transactions";
import Posts from "./pages/admin/Posts";
import Fees from "./pages/admin/Fees";
// import ProtectedRoute from "./components/ProtectedRoute";

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
        <Route path="/products" element={<ProductPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:id" element={<BlogDetailPage />} />
        <Route path="/sellVehicle" element={<SellVehiclePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<MemberLayout />}>
          <Route index element={<Profile />} />
          <Route path="address" element={<Address />} />
          <Route path="transactionHistory" element={<TransactionHistory />} />
        </Route>
        {/* <Route element={<ProtectedRoute requiredRole="admin" />}> */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path="users" element={<Users />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="posts" element={<Posts />} />
          <Route path="fees" element={<Fees />} />
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
