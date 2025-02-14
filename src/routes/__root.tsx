import { createRootRoute, Outlet } from "@tanstack/react-router";
import Pending from "../components/Pending";
import Success from "../components/Success";
import Denied from "../components/Denied";
import Error from "../components/Error";
import Navigation from "../components/Navigation";
import Header from "../components/Header";

export const Route = createRootRoute({
  component: () => (
    <div>
      <Pending />
      <Success />
      <Denied />
      <Error />
      <Header />
      <div className="container mx-auto px-4 lg:px-0 lg:mx-auto flex">
        <div className="mt-2 lg:mt-10 flex w-full gap-10">
          <div className="flex flex-col gap-5 hidden lg:blockhidden lg:block">
            <Navigation />
          </div>
          <div className="grow">
            <div className="mx-auto max-w-[800px]">
              <Outlet />
            </div>
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
