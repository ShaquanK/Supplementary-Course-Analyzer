import "./App.css";
import { AuthProvider } from "./utils/AuthContext";
import RouteProvider from "./utils/routes";

function App() {
  return (
    <AuthProvider>
      <div>
        <RouteProvider />
      </div>
    </AuthProvider>
  );
}

export default App;
