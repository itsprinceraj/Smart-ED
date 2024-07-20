import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Navbar } from "./components/common/Navbar";
import { useState } from "react";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { ErrorPage } from "./pages/ErrorPage";
import { OpenRoute } from "./components/auth/OpenRoute";
import { ResetPassword } from "./pages/ResetPassword";
import { MyProfile } from "./components/dashboard/MyProfile";

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

        {/* ResetPassword Route */}
        <Route
          path="/reset-password"
          element={
            <OpenRoute>
              <ResetPassword />
            </OpenRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/dashboard/my-profile" element={<MyProfile />} />

        {/*  not found Page */}

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
