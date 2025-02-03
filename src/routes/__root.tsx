import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <Outlet />
  ),
  notFoundComponent: () => (
    <div className="p-2">
      <h1>404</h1>
    </div>
  ),
});
