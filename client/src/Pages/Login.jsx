import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setToken } from "../redux/slices/auth";
import { setUserDetails } from "../redux/slices/user";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    const toastId = toast.loading("Logging in...");

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        formData,
      );

      if (!response.data.success) {
        throw new Error("Login failed");
      }

      // ✅ Persist token and user in Redux + localStorage
      dispatch(setToken(response.data.token));
      dispatch(setUserDetails(response.data.user));

      toast.dismiss(toastId);
      toast.success(response.data.message);
      navigate("/home");
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[400px]">
      <div className="bg-gray-800 px-6 py-8 flex justify-center flex-col items-center rounded-[20px]">
        <div className="flex gap-2 flex-col items-center mb-6">
          <h2 className="text-4xl font-bold">Log in</h2>
          <p className="text-gray-400">Welcome back!</p>
        </div>

        <form
          className="w-full flex flex-col gap-4"
          onSubmit={submitHandler}
        >
          <label className="flex flex-col gap-1">
            <p className="text-[18px]">Email</p>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChangeHandler}
              required
              placeholder="Enter your email"
              className="w-full outline-none bg-transparent text-white border border-gray-600 rounded-md px-4 py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <p className="text-[18px]">Password</p>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChangeHandler}
              required
              placeholder="Enter your password"
              className="w-full outline-none bg-transparent text-white border border-gray-600 rounded-md px-4 py-2"
            />
          </label>

          <div className="flex items-center">
            <button
              disabled={loading}
              type="submit"
              className="bg-yellow-400 px-6 py-2 w-full text-black font-semibold mt-2 mb-2 rounded-md transition-all duration-300 hover:bg-yellow-300 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2 justify-center mt-2 text-gray-100">
        <p>Don&apos;t have an account?</p>
        <Link to="/signup" className="underline text-blue-400">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
