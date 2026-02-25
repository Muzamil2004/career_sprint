import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import AIFeedbackPage from "./pages/AIFeedbackPage";
import SessionSummaryPopupPage from "./pages/SessionSummaryPopupPage";
import ProfilePage from "./pages/ProfilePage";
import ResourceQuestionsPage from "./pages/ResourceQuestionsPage";

function AppContent() {
  const { isSignedIn, isLoading } = useAuth();

  // this will get rid of the flickering effect
  if (isLoading) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/landingpage" element={<HomePage />} />
        <Route
          path="/login"
          element={!isSignedIn ? <LoginPage /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/register"
          element={!isSignedIn ? <RegisterPage /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/dashboard"
          element={isSignedIn ? <DashboardPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/profile"
          element={isSignedIn ? <ProfilePage /> : <Navigate to={"/login"} />}
        />

        <Route
          path="/problems"
          element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/problem/:id"
          element={isSignedIn ? <ProblemPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/session/:id"
          element={isSignedIn ? <SessionPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/session-summary"
          element={isSignedIn ? <SessionSummaryPopupPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/ai-feedback"
          element={isSignedIn ? <AIFeedbackPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/resources/:topic"
          element={isSignedIn ? <ResourceQuestionsPage /> : <Navigate to={"/login"} />}
        />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
