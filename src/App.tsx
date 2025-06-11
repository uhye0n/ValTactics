import backgroundImage from "../resources/background.png";
import { Header } from "./components/Header";
import { MainNavigation } from "./components/MainNavigation";
import { PopularScenarios } from "./components/PopularScenarios";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <div
          className="app__background"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Header />
          <MainNavigation />
          <PopularScenarios />
        </div>
      </div>
    </AuthProvider>
  );
}