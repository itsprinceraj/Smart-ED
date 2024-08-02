window.global = window;
import { Route, Routes } from "react-router-dom";
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
import { Setting } from "./components/dashboard/Setting";
import { EnrolledCourse } from "./components/dashboard/EnrolledCourse";
import { MyCart } from "./components/dashboard/cart/MyCart";
import { ACCOUNT_TYPE } from "./utilities/constants";
import { useSelector } from "react-redux";
import { MyCourses } from "./components/dashboard/instructor courses/MyCourses";
import { AddCourse } from "./components/dashboard/add course/AddCourse";
import { EditCourse } from "./components/dashboard/editCourse/EditCourse";
import { Catalog } from "./pages/Catalog";

function App() {
  const { user } = useSelector((state) => state.profile);
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter text-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/*   render catalog page */}
        <Route path="/catalog/:catalogName" element={<Catalog />} />

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

        <Route path="/reach-us" element={<Contact />} />

        {/* Dashboard Route */}

        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/*  /dashboard/my-profile */}
          <Route path="/dashboard/my-profile" element={<MyProfile />} />

          {/* /dashboard/settings -- nested Routes */}
          <Route path="/dashboard/settings" element={<Setting />} />

          {/*  protected routes only for students */}

          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/dashboard/enrolled-courses"
                element={<EnrolledCourse />}
              />

              {/*  nested route of cart under dashboard */}
              <Route path="/dashboard/cart" element={<MyCart />} />
            </>
          )}

          {/*  protected routes for Instructor only */}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="/dashboard/my-courses" element={<MyCourses />} />
              <Route path="/dashboard/add-course" element={<AddCourse />} />
              {/* edit course route */}
              <Route
                path="/dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>

        {/* About Page Route */}

        <Route path="/about" element={<About />} />

        {/*  not found Page */}

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
