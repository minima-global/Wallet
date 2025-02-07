import { createRootRoute, Outlet } from "@tanstack/react-router";
import Pending from "../components/Pending";
import Success from "../components/Success";

export const Route = createRootRoute({
  component: () => (
    <div>
      <Pending />
      <Success />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-2">
      <h1>404</h1>
    </div>
  ),
});
