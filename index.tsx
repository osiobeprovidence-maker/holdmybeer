import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import App from './App';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
  // Enable verbose logging so we can see auth token exchange in console
  verbose: true,
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // NOTE: StrictMode removed intentionally — it causes double-mount which
  // can race-condition the ?code= URL param exchange in ConvexAuthProvider.
  <ConvexAuthProvider
    client={convex}
    replaceURL={(url) => {
      // Clean the ?code= param from the URL after magic link sign-in
      window.history.replaceState({}, "", url);
    }}
  >
    <App />
  </ConvexAuthProvider>
);
