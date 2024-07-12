import { Route, Routes, Link } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter text-white">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
