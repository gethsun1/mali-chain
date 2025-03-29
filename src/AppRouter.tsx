import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegisterProperty from "./pages/RegisterProperty";
import Dashboard from "./pages/Dashboard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register-property" element={<RegisterProperty />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
