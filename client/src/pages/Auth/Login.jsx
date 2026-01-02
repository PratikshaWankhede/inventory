import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/authSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  // 🔑 NAVIGATE AFTER LOGIN SUCCESS
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded shadow w-11/12 md:w-96"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

        {/* 🔐 PASSWORD WITH TOGGLE ICON */}
        <div className="relative mb-3">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2 bottom-5 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        <Button loading={loading}>Login</Button>
      </form>
    </div>
  );
};

export default Login;
