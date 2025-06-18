import backgroundImage from "/resources/background.png";
import { Header } from "./components/Header";
import { MainNavigation } from "./components/MainNavigation";
import { PopularScenarios } from "./components/PopularScenarios";
import { AuthProvider } from "./contexts/AuthContext";
import { ScenarioProvider } from "./contexts/ScenarioContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewScenario from "./components/NewScenario";
import ScenarioEditor from "./components/ScenarioEditor/ScenarioEditorFinal";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <ScenarioProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
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
              }
            />
            <Route path="/new-scenario" element={
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
                  <NewScenario />
                </div>
              </div>
            } />            <Route path="/editor/:scenarioId" element={
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
                  <ScenarioEditor />
                </div>
              </div>
            } />
            <Route path="/scenario-editor" element={
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
                  <ScenarioEditor />
                </div>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </ScenarioProvider>
    </AuthProvider>
  );
}