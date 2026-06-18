import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onchangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitFormDataHandler = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error("Password must include 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and confirmPassword not matched");
      return;
    }

    const toastId = toast.loading("Creating account...");

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        formData,
      );

      if (!response.data.success) {
        throw new Error("Error occur during signup");
      }

      toast.dismiss(toastId);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[550px]">
      <div className="bg-gray-800 px-2 py-4 flex justify-center flex-col items-center rounded-[20px]">
        <div className="flex gap-2 flex-col items-center">
          <h2 className="text-4xl">Sign up</h2>
          <p>Sign up to continue</p>
        </div>

        <form
          className="mt-6 w-[96%] flex flex-col gap-2 items-center justify-center"
          onSubmit={submitFormDataHandler}
        >
          <label className="flex flex-col w-full gap-1">
            <p className="text-[18px]">First Name</p>
            <input
              type="text"
              className="w-full outline-none bg-transparent text-white border border-gray-600 rounded-md px-4 py-2"
              placeholder="Enter your first name"
              required
              onChange={onchangeHandler}
              name="firstName"
              value={formData.firstName}
            />
          </label>

          <label className="flex flex-col w-full gap-1">
            <p className="text-[18px]">Last Name</p>
            <input
              type="text"
              className="w-full outline-none bg-transparent text-white border border-gray-600 rounded-md px-4 py-2"
              placeholder="Enter your last name"
              required
              name="lastName"
              onChange={onchangeHandler}
              value={formData.lastName}
            />
          </label>

          <label className="flex flex-col w-full gap-1">
            <p className="text-[18px]">Email</p>
            <input
              type="email"
              className="w-full outline-none bg-transparent text-white border border-gray-600 rounded-md px-4 py-2"
              placeholder="Enter your email"
              required
              name="email"
              onChange={onchangeHandler}
              value={formData.email}
            />
          </label>

          <label className="flex flex-col w-full gap-1">
            <p className="text-[18px]">Password</p>
            <input
              type="password"
              className="w-full outline-none bg-transparent text-white border border-gray-600 rounded-md px-4 py-2"
              placeholder="Enter your password"
              required
              name="password"
              onChange={onchangeHandler}
              value={formData.password}
            />
          </label>

          <label className="flex flex-col w-full gap-1">
            <p className="text-[18px]">Confirm Password</p>
            <input
              type="password"
              className="w-full outline-none bg-transparent text-white border border-gray-600 rounded-md px-4 py-2"
              placeholder="Confirm your password"
              required
              name="confirmPassword"
              onChange={onchangeHandler}
              value={formData.confirmPassword}
            />
          </label>

          <div className="flex items-center w-full">
            <button
              disabled={loading}
              className="bg-yellow-400 px-6 py-2 w-full text-black font-semibold mt-2 mb-2 rounded-md transition-all duration-300 hover:bg-yellow-300"
              type="submit"
            >
              Create account
            </button>

            {loading && (
              <i className="fa-solid fa-spinner -ml-8 text-black animate-spin"></i>
            )}
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2 justify-center mt-2 text-gray-100">
        <p>Already have an account?</p>

        <Link to="/login" className="underline text-blue-700">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
