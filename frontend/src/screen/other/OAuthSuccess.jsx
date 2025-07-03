import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const id = params.get("id");
    const name = params.get("name");
    const email = params.get("email");
    const profilePicture = params.get("profilePicture");

    const user = {
      id,
      name,
      email,
      profilePicture
    }

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      toast.success(`Welcome, ${name}!`);
      navigate("/");
    } else {
      toast.error("OAuth login failed.");
      navigate("/login");
    }
  }, [navigate]);

  return(
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="text-lg font-semibold">Logging you in...</h1>
      </div>
    </div>
  );
};

export default OAuthSuccess;
