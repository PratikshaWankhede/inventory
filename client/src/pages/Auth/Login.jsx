import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import FormError from "../../components/common/FormError";

import { login, clearAuthError } from "../../features/auth/authSlice";
import { loginSchema } from "./login.schema";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);

  // eslint-disable-next-line react-hooks/incompatible-library
  const emailValue = watch("email");
  const passwordValue = watch("password");

  // 🔐 Submit Handler
  const onSubmit = (data) => {
    if (loading) return;

    dispatch(
      login({
        email: data.email.toLowerCase().trim(),
        password: data.password.trim(),
      })
    );
  };

  //  Navigate after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // 🧹 Clear server errors on route change / unmount
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-400 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <FiLock className="text-white text-2xl" aria-hidden />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* SERVER ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* EMAIL */}
          <div className="relative">
            <FiMail
              className="absolute top-4 left-3 text-gray-400"
              aria-hidden
            />
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              aria-invalid={!!errors.email}
              className="pl-10 h-12"
            />
            <FormError message={errors.email?.message} />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <FiLock
              className="absolute top-4 left-3 text-gray-400"
              aria-hidden
            />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className="pl-10 pr-12 h-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-4 right-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            <FormError message={errors.password?.message} />
          </div>

          <Button
            loading={loading}
            disabled={!emailValue || !passwordValue || loading}
            className="w-full bg-linear-to-r from-blue-500 to-purple-600 text-white"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
