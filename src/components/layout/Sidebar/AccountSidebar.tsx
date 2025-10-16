"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRef } from "react";
import Image from "next/image";

const menuItems = [
  { id: 0, label: "THÔNG TIN CÁ NHÂN", to: "/account" },
  { id: 1, label: "ĐỊA CHỈ", to: "/account/address" },
  { id: 2, label: "LỊCH SỬ GIAO DỊCH", to: "/account/transactionHistory" },
  { id: 3, label: "ĐĂNG XUẤT", to: "/account/logout" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { formData, currentUser, avatar, setAvatar } = useUserProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setAvatar(reader.result.toString());
        localStorage.setItem("userAvatar", reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 w-full border-r bg-white rounded-xl shadow-sm">
      {/* Avatar section */}
      <div className="flex flex-col items-center relative">
        <div
          className="relative w-20 h-20 bg-gray-100 rounded-full mb-3 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition"
          onClick={handleAvatarClick}
        >
          {avatar ? (
            <Image src={avatar} alt="Avatar" fill className="object-cover" />
          ) : (
            <svg
              className="w-12 h-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2c-3.2 0-9.5 1.6-9.5 4.9V22h19v-3.1c0-3.3-6.3-4.9-9.5-4.9z" />
            </svg>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <h3 className="text-lg font-semibold text-gray-800">
          {formData.name || "User Name"}
        </h3>
        <span className="text-sm text-gray-600 mt-1">
          {currentUser?.email || "example@student.ut.edu.vn"}
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-3 font-medium text-gray-700">
        {menuItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.id}
              href={item.to}
              className={`block border-b pb-2 transition ${
                isActive
                  ? "text-blue-600 border-blue-300 font-semibold"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
