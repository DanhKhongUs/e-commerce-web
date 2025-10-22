"use client";

import AccountSidebar from "@/components/layout/Sidebar/AccountSidebar";
import { usePathname } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getCurrentLabel = (pathname: string) => {
    if (pathname.endsWith("/account/address")) return "ĐỊA CHỈ";
    if (pathname.endsWith("/account/transactionHistory"))
      return "LỊCH SỬ GIAO DỊCH";
    return "THÔNG TIN CÁ NHÂN";
  };

  const currentLabel = getCurrentLabel(pathname);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-screen-2xl mx-auto">
      <div className="border-b px-8 py-4">
        <h1 className="text-gray-600 text-3xl font-bold mb-2">HỒ SƠ</h1>
        <h2 className="uppercase  text-gray-700 tracking-wider">
          {currentLabel}
        </h2>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-[500px]">
          <AccountSidebar />
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
