import * as React from "react";               // import React as a namespace
import * as ReactDOM from "react-dom/client"; // import ReactDOM as a namespace
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);