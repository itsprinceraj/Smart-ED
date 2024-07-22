import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Navbar } from "./components/common/Navbar";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { ErrorPage } from "./pages/ErrorPage";
import { OpenRoute } from "./components/auth/OpenRoute";
import { ResetPassword } from "./pages/ResetPassword";
import { MyProfile } from "./components/dashboard/MyProfile";
import { UpdatePassword } from "./pages/UpdatePassword";
import { VerifyEmail } from "./pages/VerifyEmail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/*  Signup and Login Page Routes */}

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        {/* verify email route */}
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        {/* ResetPassword Route */}
        <Route
          path="/reset-password"
          element={
            <OpenRoute>
              <ResetPassword />
            </OpenRoute>
          }
        />

        {/* update-password route */}

        <Route
          path="/reset-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        {/* contact us page */}

        <Route
          path="/reach-us"
          element={
            <OpenRoute>
              <Contact />
            </OpenRoute>
          }
        />

        {/* Dashboard Route */}

        {/* <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/dashboard/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        {/* About Page Route */}

        <Route path="/about" element={<About />} />

        {/*  not found Page */}

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
