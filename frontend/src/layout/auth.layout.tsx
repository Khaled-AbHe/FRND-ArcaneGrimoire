import myLogo from "../images/ButterzIcon.png";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-bg">
      <div className="auth-panel animate-fade-in">
        <h1 className="auth-title">Butterz's Arcane Grimoire</h1>
        <img className="mt-5 size-20" src={myLogo} />

        <div className="auth-divider" />
        {children}
      </div>
    </div>
  );
}
