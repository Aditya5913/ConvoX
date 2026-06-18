import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux"; // ✅ Added
import { Toaster } from "react-hot-toast"; // ✅ Added
import "./index.css";
import App from "./App.jsx";
import { store } from "./redux/store.js"; // ✅ Added

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>  {/* ✅ Wrap with Redux Provider */}
      <App />
      <Toaster position="top-right" />  {/* ✅ Global toast notifications */}
    </Provider>
  </StrictMode>,
);
