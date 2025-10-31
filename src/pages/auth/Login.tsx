import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

export default function LoginPage() {
  const { actions } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await actions.signin({ email, password });

    setIsLoading(false);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm min-h-screen mx-auto mt-20 space-y-4 "
    >
      <h2 className="text-xl font-semibold text-center">Đăng nhập</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <button
        type="submit"
        onClick={handleLogin}
        className="w-full py-2 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition duration-300 cursor-pointer"
      >
        {isLoading ? "Đang xử lý..." : "Đăng nhập"}
      </button>

      <p className="text-center text-gray-600">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Đăng ký
        </Link>
      </p>
    </form>
  );
}
