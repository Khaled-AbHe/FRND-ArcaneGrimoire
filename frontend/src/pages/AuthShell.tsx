import myLogo from "../images/ButterzIcon.png";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-bg">
      <div className="auth-panel animate-fade-in">
        <h1 className="auth-title">Butterz's Arcane Grimoire</h1>
        <img className="size-20 mt-5" src={myLogo} />

        <div className="auth-divider" />
        {children}
      </div>
    </div>
  );
}
