import AdminSidebar from "./SideBar/AdminSidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();

  const getCurrentLabel = (pathname: string) => {
    if (pathname === "/admin/users") return "QUẢN LÝ NGƯỜI DÙNG";
    if (pathname === "/admin/posts") return "QUẢN LÝ TIN ĐĂNG";
    if (pathname === "/admin/transactions") return "QUẢN LÝ GIAO DỊCH";
    if (pathname === "/admin/fees") return "QUẢN LÝ PHÍ & HOA HỒNG";
    return "THỐNG KÊ & BÁO CÁO";
  };

  const currentLabel = getCurrentLabel(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="ml-6 text-xl font-bold">{currentLabel}</h1>
        <Outlet />
      </main>
    </div>
  );
}
