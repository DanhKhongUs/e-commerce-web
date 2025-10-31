export default function Address() {
  return (
    <div className="flex flex-col-reverse lg:flex-row w-full gap-8 px-4">
      <div className="flex-1 bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-6">Địa chỉ mặc định</h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              placeholder="Nguyễn Văn A"
              className="w-full border p-3 rounded focus:outline-none focus:shadow-md placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              placeholder="0123456789"
              className="w-full border p-3 rounded focus:outline-none focus:shadow-md placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Tỉnh/Thành</label>
            <input
              type="text"
              name="city"
              placeholder="Thành phố Hồ Chí Minh"
              className="w-full border p-3 rounded focus:outline-none focus:shadow-md placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Phường/Xã</label>
            <input
              type="text"
              name="city"
              placeholder="Phường Sài Gòn"
              className="w-full border p-3 rounded focus:outline-none focus:shadow-md placeholder-gray-400"
              required
            />
          </div>
        </form>
        <div>
          <label className="block font-medium mb-2">Địa chỉ</label>
          <input
            type="text"
            name="address"
            placeholder="123 Đường ABC"
            className="w-full border p-3 rounded focus:outline-none focus:shadow-md placeholder-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-8 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
