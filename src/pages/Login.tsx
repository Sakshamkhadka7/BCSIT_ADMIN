import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminProvider";
const API=import.meta.env.VITE_API_URL


const Login = () => {
  const navigate = useNavigate();

  const [form, setFormData] = useState({
    email: "",
    password: "",
  });

  const context = useContext(AdminContext);
  
  if (!context) {
    return null;
  }

  const { setAdmin } = context;

  const validateForm = () => {
    const { email, password } = form;
    if (!email.trim() || !password.trim()) {
      alert("Email and password is required");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch(`${API}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          role: "admin",
        }),
      });

      const data = await res.json();
      console.log("Data is here",data);
      if (!res.ok) {
        alert("Login failed");
        return;
      }

      alert("Login successfully");
      console.log(data.data);
      setAdmin(data.data);
      navigate("/access");
    } catch (error) {
      console.log("Error occured at login", error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 px-2">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 mt-2">Login to access admin dashboard</p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold text-gray-700">Email</label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold text-gray-700">
              Password
            </label>

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-3 rounded-xl font-semibold"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
