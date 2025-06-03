import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginInStart, loginInSuccess, loginInFailure } from "../features/user/userSlice";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const { loading, error } = useSelector((state) => state.user);
  const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:4000';  // Defaulting to localhost if not found
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    dispatch(loginInStart());

    const { firstName, lastName, email, password } = formData;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      dispatch(loginInFailure("Please fill out all fields completely."));
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/register-client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status > 210) {
        const error = await response.json();
        dispatch(loginInFailure(error.message));
        return;
      }

      // Successfully registered
      toast.success("Account created successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Slide,
      });

      // Navigate to login page
      navigate("/login");

    } catch (err) {
      // Handle server error
      dispatch(loginInFailure("Server error occurred. Please try again later."));
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-[#0B1724] shadow rounded sm:w-full md:w-full max-w-[500px] p-8 flex-shrink-0">
        <p className="text-2xl font-medium text-center text-[#cae962]">Create your account</p>
        <p className="text-sm mt-4 text-center text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-300 hover:underline">
            Login
          </Link>
        </p>
        <div className="flex items-center justify-between py-5">
          <hr className="w-full bg-gray-400" />
          <p className="text-base font-medium text-[#cae962] px-2">OR</p>
          <hr className="w-full bg-gray-400" />
        </div>
        <form onSubmit={handleSignup}>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="text-sm font-medium text-[#cae962]">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium text-[#cae962]">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-[#cae962]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
            />
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium text-[#cae962]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
            />
          </div>
          {error && <p className="text-center text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-[#cae962] text-[#0B1724] font-semibold rounded hover:bg-white transition"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </section>
  );
}
