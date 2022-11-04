import React from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import HomePage from "./components/homePage";
import Profile from "./components/profile";
import ProtectedRoute from "./auth/protected-route";

const App = () => {
  return (
    <div id="app" className="d-flex flex-column h-100">
      <div className="container flex-grow-1">
        <Routes>
          <Route path="/" exact element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
