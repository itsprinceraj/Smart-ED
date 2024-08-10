import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken } from "../../redux/slices/authSlice";
import { setUser } from "../../redux/slices/profileSlice";
import toast from "react-hot-toast";

const GoogleSignIn = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    //  create a new object and search parameters in url
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const userData = JSON.parse(queryParams.get("userData"));

    //if token and data is present then set data to all its state
    if (token && userData) {
      // Dispatch actions to Redux
      dispatch(setToken(token));
      dispatch(setUser(userData));

      // Store data in localStorage
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to dashboard
      // window.location.href = "/dashboard/my-profile";
      navigate("/dashboard/my-profile");
      toast.success("User Login Successfull");
    }
  }, [location.search, navigate, dispatch]);

  return (
    <div>
      <div className="spinner"></div>;
    </div>
  );
};

export default GoogleSignIn;
