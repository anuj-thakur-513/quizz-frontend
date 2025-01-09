import { Route, Routes } from "react-router-dom";
import "./index.css";
import { Suspense, lazy } from "react";
import axios from "axios";

// Lazy load
const Auth = lazy(() => import("./pages/Auth"));

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Auth />} />
          {/* <Route path="/home" element={<Home />} /> */}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
