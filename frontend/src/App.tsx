import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/layout/RequireAuth";
import { CharacterLayout } from "./layout/character.layout";
import { UserLayout } from "./layout/user.layout";
import { SignInPage } from "./pages/auth/sign-in.page";
import { SignUpPage } from "./pages/auth/sign-up.page";

export default function App() {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route
        path="/grimoire"
        element={
          <RequireAuth>
            <UserLayout />
          </RequireAuth>
        }
      />
      <Route
        path="/character/:id"
        element={
          <RequireAuth>
            <CharacterLayout />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}
