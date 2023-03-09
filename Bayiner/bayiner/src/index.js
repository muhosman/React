import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NavigationProvider } from "./context/navigation";
import { UsersProvider } from "./context/users";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { store } from "./store";
const el = document.getElementById("root");
const root = ReactDOM.createRoot(el);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <UsersProvider>
          <NavigationProvider>
            <AuthProvider>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </AuthProvider>
          </NavigationProvider>
        </UsersProvider>
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
