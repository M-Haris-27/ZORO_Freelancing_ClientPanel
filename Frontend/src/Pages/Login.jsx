import ForgotPasswordModal from './ForgotPassword';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginInFailure, loginInStart, loginInSuccess } from '../features/user/userSlice';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { loading, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:4000';

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginInStart());
    const { email, password } = formData;

    if (!email || !password) {
      dispatch(loginInFailure('Please fill the form completely.'));
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login-user`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status > 210) {
        const error = await response.json();
        dispatch(loginInFailure(error.message));
        return;
      }

      const data = await response.json();
      dispatch(loginInSuccess(data.user));
      navigate('/dashboard');
    } catch (err) {
      dispatch(loginInFailure('Server error occurred. Please try again later.'));
    }
  };

  return (
    <>
      <section className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[#0B1724] shadow rounded sm:w-full md:w-full max-w-[500px] p-8 flex-shrink-0">
          <p className="text-2xl font-medium text-center text-[#cae962]">Login to your account</p>
          <p className="text-sm mt-4 text-center text-white">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-300 hover:underline">
              Sign Up
            </Link>
          </p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="text-sm font-medium text-[#cae962]">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
              />
            </div>
            <div className="mb-6">
              <label className="text-sm font-medium text-[#cae962]">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full mt-2 p-3 bg-gray-200 border rounded text-black"
              />
              <div
                className="text-right mt-2 text-blue-300 hover:underline cursor-pointer"
                onClick={() => setShowForgotPasswordModal(true)}
              >
                Forgot Password?
              </div>
            </div>
            {error && <p className="text-center text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#cae962] text-[#0B1724] font-semibold rounded hover:bg-white transition"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </section>

      {showForgotPasswordModal && (
        <ForgotPasswordModal onClose={() => setShowForgotPasswordModal(false)} />
      )}
    </>
  );
}
