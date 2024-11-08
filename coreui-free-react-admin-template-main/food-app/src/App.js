import React, { useEffect } from "react";
import Routes from './routes';  
import "./index.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

function App() {
  
  const location = useLocation();

  useEffect(() => {
    // Get body element
    const body = document.body;

    // Toggle class based on path
    if (location.pathname === "/register" || location.pathname === "/admin") {
      body.classList.add("center-body");
    } else {
      body.classList.remove("center-body");
    }
  }, [location]);

  return <Routes />;

}

export default App;
