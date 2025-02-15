import Decimal from "decimal.js"
Decimal.set({ precision: 64 });

import { MDS } from "@minima-global/mds"
import {
  createRouter,
  RouterProvider,
  createMemoryHistory,
} from "@tanstack/react-router"
import React from "react"
import ReactDOM from "react-dom/client"
import AppProvider from "./AppContext.tsx"
import "./index.css"

import { routeTree } from "./routeTree.gen"

const memoryHistory = createMemoryHistory({
  initialEntries: ["/"],
})

const router = createRouter({
  routeTree,
  history: memoryHistory
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

if (import.meta.env.DEV) {
  MDS.DEBUG_HOST = import.meta.env.VITE_DEBUG_HOST
  MDS.DEBUG_PORT = Number(import.meta.env.VITE_DEBUG_MDS_PORT)
  MDS.DEBUG_MINIDAPPID = import.meta.env.VITE_DEBUG_SESSION_ID
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
)
