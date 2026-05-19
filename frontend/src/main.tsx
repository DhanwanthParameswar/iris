import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import type { AppState } from "@auth0/auth0-react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import App from "./App.tsx";
import { FirebaseAuthProvider } from "./components/FirebaseAuthProvider.tsx";
import "./App.css";
import "./index.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

// Create a wrapper component to use the navigate hook
const Auth0ProviderWithNavigate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    const returnTo =
      (appState as { returnTo?: string; targetUrl?: string } | undefined)
        ?.returnTo ??
      (appState as { targetUrl?: string } | undefined)?.targetUrl ??
      "/dashboard";
    navigate(returnTo, { replace: true });
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <FirebaseAuthProvider>
          <App />
        </FirebaseAuthProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>,
);
