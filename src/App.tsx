import backgroundImage from "../resources/background.png";
import { Header } from "./components/Header";
import { MainNavigation } from "./components/MainNavigation";
import { PopularScenarios } from "./components/PopularScenarios";
import "./App.css";
import "./App.css";

export default function App() {
  return (
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
  );
}