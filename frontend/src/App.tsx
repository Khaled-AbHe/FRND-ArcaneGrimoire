import { Routes, Route, Navigate } from "react-router-dom";
import { CharacterSelect } from "./components/layout/CharacterSelect";
import { CharacterPage } from "./pages/CharacterPage";
import { RequireAuth } from "./components/layout/RequireAuth";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <CharacterSelect />
          </RequireAuth>
        }
      />
      <Route
        path="/character/:id"
        element={
          <RequireAuth>
            <CharacterPage />
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
