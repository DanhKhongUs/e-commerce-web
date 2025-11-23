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
import Home from "./pages/home/Home";
import AddProductPage from "./pages/admin/AddProduct";
import OrderSuccess from "./pages/product/CheckoutSuccess";
import CheckoutSuccess from "./pages/product/CheckoutSuccess";
import CheckoutFailure from "./pages/product/CheckoutFailure";
import LoginForAdmin from "./pages/admin/LoginForAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import OrderDetail from "./pages/member/OrderDetail";
import UsersManage from "./pages/admin/UsersManage";
import OrdersManage from "./pages/admin/OrdersManage";

function AppContent() {
  const location = useLocation();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  const hideFooterRegex =
    /^\/(products\/\d+|cart|checkout|checkout-success|checkout-failure|blogs)$/; // match /products/123, / (home)
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
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/checkout-failure" element={<CheckoutFailure />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/account" element={<MemberLayout />}>
          <Route index element={<Profile />} />
          <Route path="transactionHistory" element={<TransactionHistory />} />
          <Route path="transactionHistory/:id" element={<OrderDetail />} />
        </Route>

        <Route path="/admin/login" element={<LoginForAdmin />} />
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashBoard />} />
            <Route path="products" element={<AddProductPage />} />
            <Route path="users" element={<UsersManage />} />
            <Route path="orders" element={<OrdersManage />} />
          </Route>
        </Route>
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
