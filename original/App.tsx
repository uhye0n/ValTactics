import backgroundImage from "figma:asset/7cc286d72f5672242ec4a20c300fb1ed756a909b.png";
import { Header } from "./components/Header";
import { MainNavigation } from "./components/MainNavigation";
import { PopularScenarios } from "./components/PopularScenarios";

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