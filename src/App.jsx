import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import LandingPage from "./page/LandingPage";
import DashboardPage from "./page/DashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleManagementPage from "./page/RoleManagementPage";
import UserManagementPage from "./page/UserManagementPage";
import BookManagementPage from "./page/BookManagementPage";
import MemberManagementPage from "./page/MemberManagementPage";
import BorrowingManagementPage from "./page/BorrowingManagementPage";
import AuditPage from "./page/AuditPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/role-management" element={<RoleManagementPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/book-management" element={<BookManagementPage />} />
          <Route path="/member-management" element={<MemberManagementPage />} />
          <Route
            path="/borrowing-management"
            element={<BorrowingManagementPage />}
          />
          <Route path="/audit" element={<AuditPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
