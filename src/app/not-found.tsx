"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Không tìm thấy trang";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-sky-50">
      <Image
        src="/illustrations/404.svg"
        alt="Not Found"
        width={400}
        height={300}
        className="mb-6"
        priority
      />

      <h1 className="text-5xl font-bold text-sky-700">404</h1>
      <p className="text-xl mt-3 text-sky-800 font-semibold">
        Không tìm thấy trang bạn đang tìm!
      </p>
      <p className="text-gray-600 mt-2 max-w-md">
        Địa chỉ có thể đã bị xóa hoặc không tồn tại. Hãy thử quay lại hoặc về
        trang chủ nhé.
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => router.back()}
          className="bg-white text-sky-700 border border-sky-600 hover:bg-sky-100 rounded-full px-6 cursor-pointer"
        >
          Quay lại
        </button>
        <Link href="/">
          <button className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-6 cursor-pointer">
            Trang chủ
          </button>
        </Link>
      </div>
    </div>
  );
}
