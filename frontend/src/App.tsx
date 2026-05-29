import { Routes, Route, Navigate } from "react-router-dom";
import { UserPage } from "./pages/UserPage";
import { CharacterPage } from "./pages/CharacterPage";
import { RequireAuth } from "./components/layout/RequireAuth";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";

export default function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <UserPage />
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
