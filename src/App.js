import { SnackbarProvider } from "notistack";
import "./App.css";
import { AuthProvider } from "./utils/AuthContext";
import RouteProvider from "./utils/routes";

function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <div>
          <RouteProvider />
        </div>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
