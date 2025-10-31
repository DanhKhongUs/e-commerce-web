import { NavLink, useNavigate } from "react-router-dom";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faHouse,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
  faExchangeAlt,
  faMoneyBillTrendUp,
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
  {
    id: 0,
    label: "THỐNG KẾ & BÁO CÁO",
    to: ".",
    icon: <FontAwesomeIcon icon={faHouse} />,
  },
  {
    id: 1,
    label: "QUẢN LÝ NGƯỜI DÙNG",
    to: "users",
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    id: 2,
    label: "QUẢN LÝ TIN ĐĂNG",
    to: "posts",
    icon: <FontAwesomeIcon icon={faFileLines} />,
  },
  {
    id: 3,
    label: "QUẢN LÝ GIAO DỊCH",
    to: "transactions",
    icon: <FontAwesomeIcon icon={faExchangeAlt} />,
  },
  {
    id: 4,
    label: "QUẢN LÝ PHÍ & HOA HỒNG",
    to: "fees",
    icon: <FontAwesomeIcon icon={faMoneyBillTrendUp} />,
  },
];
export default function AdminSidebar() {
  const { setCurrentUser } = useUserProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <aside className="w-72 bg-white rounded-xl border shadow p-3 space-y-6">
      <div className="flex items-center cursor-pointer">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-26 h-28 rounded-full object-cover "
        />
        <span className="text-lg font-black">EV & Battery</span>
      </div>
      <h1 className="text-md mb-2 border-b pb-4">MAIN MENU</h1>

      <div className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.to === "."}
            className={({ isActive }) =>
              `block pb-2 transition ${
                isActive
                  ? "text-blue-600 bg-blue-50 rounded-md p-4 font-semibold"
                  : "text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-md p-4"
              }`
            }
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="text-red-600 border-t hover:bg-red-50 flex rounded-md p-4  font-semibold"
        >
          ĐĂNG XUẤT
        </button>
      </div>
    </aside>
  );
}
