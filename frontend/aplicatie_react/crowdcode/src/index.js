
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {AuthProvider, useAuth} from "./AuthContext";
import Layout from "./Layout";
import Home from "./Home";
import Profile from "./Profile";
import Inbox from "./Inbox";
import MyIssues from "./MyIssues";
import MyRepos from "./MyRepos";
import LoginPage from "./LoginPage";
import NoPage from "./NoPage";
import {Navigate} from "react-router";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<><Profile /></>} />
            <Route path="inbox" element={<><Inbox /></>} />
            <Route path="myissues" element={<><MyIssues /></>} />
            <Route path="myrepos" element={<><MyRepos /></>} />
            <Route path="login" element={<LoginPage />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
