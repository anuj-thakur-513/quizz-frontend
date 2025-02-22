import { Route, Routes } from "react-router-dom";
import "./index.css";
import { Suspense, lazy } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";

// Lazy load
const Auth = lazy(() => import("./pages/Auth"));

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
