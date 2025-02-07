import { createRootRoute, Outlet } from "@tanstack/react-router";
import Pending from "../components/Pending";
import Success from "../components/Success";
import Navigation from "../components/Navigation";
import Header from "../components/Header";

export const Route = createRootRoute({
  component: () => (
    <div>
      <Pending />
      <Success />
      <Header />
      <div className="mt-4 lg:mt-10 container mx-auto px-4 lg:px-0 lg:mx-auto flex">
        <div className="flex w-full gap-10">
          <div className="flex flex-col gap-5 hidden lg:blockhidden lg:block">
            <Navigation />
          </div>
          <div className="grow flex flex-col">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-2">
      <h1>404</h1>
    </div>
  ),
});
