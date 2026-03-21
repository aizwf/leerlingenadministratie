function AppShell({ title, role, children, actions }) {
  return (
    <div>
      <div className="app-shell">
        <div>
          <div className="app-shell-title">{title}</div>
          <div className="app-shell-subtitle">Ingelogd als: {role}</div>
        </div>

        <div className="app-shell-actions">{actions}</div>
      </div>

      <div className="container">{children}</div>
    </div>
  );
}

export default AppShell;