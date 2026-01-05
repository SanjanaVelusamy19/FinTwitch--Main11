import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./context/UserContext";
import { ToastsProvider } from "./context/ToastContext";

// Components
import Shell from "./components/Shell";

// Pages
import HomePage from "./pages/HomePage";
import GamesArea from "./pages/GamesArea";
import CareerLevelPage from "./pages/CareerLevelPage";
import DreamLifePlanner from "./pages/DreamLifePlanner";
import StockMarketGame from "./pages/StockMarketGame";
import ToolsArea from "./pages/ToolsArea";
import ArticlesArea from "./pages/ArticlesArea";
import HabitTracker from "./pages/HabitTracker";
import TransactionsArea from "./pages/TransactionsArea";
import Login from "./pages/Login";
import ModeSelection from "./pages/ModeSelection";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useUser();

  // Only show spinner if we are strictly in a loading state with no user data
  if (isLoading && !user?.username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user?.username) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <ToastsProvider>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/mode-selection"
            element={
              <ProtectedRoute>
                <ModeSelection />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Shell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/mode-selection" replace />} />
            <Route path="games" element={<GamesArea />} />
            <Route path="games/career/:levelId" element={<CareerLevelPage />} />
            <Route path="games/dreamlife" element={<DreamLifePlanner />} />
            <Route path="games/stockmarket" element={<StockMarketGame />} />
            <Route path="tools" element={<ToolsArea />} />
            <Route path="articles" element={<ArticlesArea />} />
            <Route path="habit" element={<HabitTracker />} />
            <Route path="transactions" element={<TransactionsArea />} />
          </Route>
        </Routes>
      </UserProvider>
    </ToastsProvider>
  );
}
