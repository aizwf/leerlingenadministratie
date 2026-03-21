function LoginScreen({ onLogin }) {
    return (
      <div style={{ padding: 40 }}>
        <h1>AIZW Leerlingenadministratie</h1>
        <p>Kies een rol om in te loggen</p>
  
        <button onClick={() => onLogin("HR")}>HR</button>
        <button onClick={() => onLogin("SLB")}>SLB</button>
        <button onClick={() => onLogin("Finance")}>Finance</button>
        <button onClick={() => onLogin("Subsidie")}>Subsidie</button>
      </div>
    );
  }
  
  export default LoginScreen;