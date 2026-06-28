import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddTask from "./pages/AddTask";
import AICoach from "./pages/AICoach"; 
import Rewards from './pages/Rewards';
import DashboardLayout from "./components/DashboardLayout"; // Import the layout wrapper
import History from "./pages/History";
import CalendarView from "./pages/CalendarView"; 
import ProfileSettings from "./pages/ProfileSettings";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Public Pages (NO SIDEBAR) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. Internal App Pages (ALL WILL AUTOMATICALLY HAVE THE SIDEBAR) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/history" element={<History />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}